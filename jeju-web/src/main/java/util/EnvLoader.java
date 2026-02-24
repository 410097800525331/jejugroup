package util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.net.URISyntaxException;
import java.security.CodeSource;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;

/**
 * Lightweight .env loader with deterministic resolution order.
 * Priority: explicit env.file/ENV_FILE -> class-location based candidates -> user.dir candidates.
 */
public class EnvLoader {
    private static final Map<String, String> envMap = new HashMap<>();
    private static boolean isLoaded = false;

    public static String get(String key) {
        if (!isLoaded) {
            load();
        }

        String envFileVal = envMap.get(key);
        if (envFileVal != null && !envFileVal.isEmpty()) {
            return envFileVal;
        }

        return System.getenv(key);
    }

    private static synchronized void load() {
        if (isLoaded) {
            return;
        }

        String userDir = System.getProperty("user.dir");
        System.out.println("[EnvLoader] Initializing... (Current user.dir: " + userDir + ")");

        File envFile = findEnvFile(userDir);
        if (envFile == null) {
            System.out.println("[EnvLoader] WARNING: .env NOT FOUND. DB properties might be missing.");
            isLoaded = true;
            return;
        }

        System.out.println("[EnvLoader] Found .env at: " + envFile.getAbsolutePath());

        try (BufferedReader br = new BufferedReader(new FileReader(envFile))) {
            String line;
            while ((line = br.readLine()) != null) {
                line = stripBom(line).trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }

                String[] parts = line.split("=", 2);
                if (parts.length == 2) {
                    envMap.put(parts[0].trim(), parts[1].trim());
                }
            }

            System.out.println("[EnvLoader] SUCCESS: Environments loaded.");
            envMap.forEach((k, v) ->
                System.out.println("[EnvLoader] Key: " + k + ", Value Length: " + (v != null ? v.length() : 0))
            );
        } catch (Exception e) {
            System.err.println("[EnvLoader] CRITICAL ERROR: " + e.getMessage());
        }

        isLoaded = true;
    }

    private static File findEnvFile(String userDir) {
        LinkedHashSet<File> candidates = new LinkedHashSet<>();

        addCandidate(candidates, System.getProperty("env.file"));
        addCandidate(candidates, System.getenv("ENV_FILE"));
        addTomcatCandidates(candidates);

        File classBaseDir = resolveClassBaseDir();
        int depth = 0;
        while (classBaseDir != null && depth < 10) {
            candidates.add(new File(classBaseDir, ".env"));
            candidates.add(new File(classBaseDir, "jeju-web/.env"));
            candidates.add(new File(classBaseDir, "src/main/webapp/WEB-INF/.env"));
            classBaseDir = classBaseDir.getParentFile();
            depth++;
        }

        if (userDir != null && !userDir.trim().isEmpty()) {
            candidates.add(new File(userDir, "jeju-web/.env"));
            candidates.add(new File(userDir, ".env"));
            addWorkspaceCandidates(candidates, new File(userDir));
        }

        // Explicit fallback for current local project layout.
        candidates.add(new File("D:/lsh/git/jejugroup/jeju-web/.env"));

        for (File f : candidates) {
            if (f != null && f.isFile() && f.canRead()) {
                return f;
            }
        }

        return null;
    }

    private static void addTomcatCandidates(LinkedHashSet<File> candidates) {
        String catalinaBase = System.getProperty("catalina.base");
        if (catalinaBase == null || catalinaBase.trim().isEmpty()) {
            return;
        }

        File base = new File(catalinaBase.trim());
        candidates.add(new File(base, "conf/.env"));
        candidates.add(new File(base, "webapps/jeju-web/WEB-INF/.env"));
        candidates.add(new File(base, "wtpwebapps/jeju-web/WEB-INF/.env"));
    }

    private static void addWorkspaceCandidates(LinkedHashSet<File> candidates, File startDir) {
        File cursor = startDir;
        int depth = 0;
        while (cursor != null && depth < 8) {
            candidates.add(new File(cursor, "git/jejugroup/jeju-web/.env"));
            candidates.add(new File(cursor, "jejugroup/jeju-web/.env"));
            cursor = cursor.getParentFile();
            depth++;
        }
    }

    private static void addCandidate(LinkedHashSet<File> candidates, String path) {
        if (path == null || path.trim().isEmpty()) {
            return;
        }
        candidates.add(new File(path.trim()));
    }

    private static File resolveClassBaseDir() {
        try {
            CodeSource source = EnvLoader.class.getProtectionDomain().getCodeSource();
            if (source == null || source.getLocation() == null) {
                return null;
            }
            File location = new File(source.getLocation().toURI());
            return location.isFile() ? location.getParentFile() : location;
        } catch (URISyntaxException e) {
            return null;
        }
    }

    private static String stripBom(String line) {
        if (line != null && !line.isEmpty() && line.charAt(0) == '\uFEFF') {
            return line.substring(1);
        }
        return line;
    }
}
