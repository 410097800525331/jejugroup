const fs = require('fs');
const path = require('path');

const root = 'd:/lsh/git/jejuTeam';
process.chdir(root);

// Function to recursively find all files
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file).replace(/\\/g, '/'));
    }
  });

  return arrayOfFiles;
}

// Get all files from relevant dirs, except ignored
let files = [];
['sub', 'css', 'js', 'components', 'assets', 'index.html'].forEach(dir => {
    if (fs.existsSync(dir)) {
        if (fs.statSync(dir).isDirectory()) {
            files = files.concat(getAllFiles(dir));
        } else {
            files.push(dir);
        }
    }
});

// Create directories mapping
const moveMap = [
    // Admin
    { test: /^sub\/admin\/([a-zA-Z0-9_-]+)\.html$/, target: 'admin/pages/$1.html' },
    { test: /^css\/admin\/([a-zA-Z0-9_-]+)\.css$/, target: 'admin/css/$1.css' },
    { test: /^js\/admin\/([a-zA-Z0-9_-]+)\.js$/, target: 'admin/js/$1.js' },

    // Components - Header
    { test: /^components\/hotel_header\.html$/, target: 'components/layout/header/header.html' },
    { test: /^css\/hotel_header\.css$/, target: 'components/layout/header/header.css' },
    { test: /^js\/hotel_header\.js$/, target: 'components/layout/header/header.js' },
    { test: /^js\/header-controller\.js$/, target: 'components/layout/header/header-controller.js' },

    // Components - Footer
    { test: /^components\/hotel_footer\.html$/, target: 'components/layout/footer/footer.html' },
    { test: /^css\/hotel_footer\.css$/, target: 'components/layout/footer/footer.css' },
    { test: /^js\/hotel_footer\.js$/, target: 'components/layout/footer/footer.js' },

    // Components - Mega Menu
    { test: /^js\/mega-menu\.js$/, target: 'components/layout/mega_menu/mega-menu.js' },
    { test: /^js\/mega_menu\.js$/, target: 'components/layout/mega_menu/mega_menu.js' },
    { test: /^css\/mega-menu\.css$/, target: 'components/layout/mega_menu/mega-menu.css' },

    // Components - UI / Widget
    { test: /^sub\/FAB\.html$/, target: 'components/ui/FAB.html' },
    { test: /^css\/FAB\.css$/, target: 'components/ui/FAB.css' },
    { test: /^css\/FAB_wishlist_transition\.css$/, target: 'components/ui/FAB_wishlist_transition.css' },
    { test: /^js\/FAB\.js$/, target: 'components/ui/FAB.js' },
    { test: /^js\/stagger_nav\.js$/, target: 'components/ui/stagger_nav.js' },
    { test: /^js\/hotel_component_loader\.js$/, target: 'components/layout/hotel_component_loader.js' },
    { test: /^css\/chatbot-style\.css$/, target: 'components/widget/chatbot-style.css' },
    { test: /^js\/chatbot\.js$/, target: 'components/widget/chatbot.js' },
    { test: /^css\/weather\.css$/, target: 'components/widget/weather.css' },
    { test: /^js\/weather\.js$/, target: 'components/widget/weather.js' },

    // Pages - Auth
    { test: /^sub\/login\.html$/, target: 'pages/auth/login.html' },
    { test: /^css\/login\.css$/, target: 'pages/auth/login.css' },
    { test: /^sub\/signup\.html$/, target: 'pages/auth/signup.html' },
    { test: /^css\/signup\.css$/, target: 'pages/auth/signup.css' },
    { test: /^js\/signup\.js$/, target: 'pages/auth/signup.js' },

    // Pages - Hotel
    { test: /^sub\/hotel-list\.html$/, target: 'pages/hotel/hotel-list.html' },
    { test: /^css\/hotel-list\.css$/, target: 'pages/hotel/hotel-list.css' },
    { test: /^js\/hotel-list\.js$/, target: 'pages/hotel/hotel-list.js' },
    { test: /^sub\/jejuhotel\.html$/, target: 'pages/hotel/jejuhotel.html' },
    { test: /^css\/hotel\.css$/, target: 'pages/hotel/hotel.css' },
    { test: /^js\/hotel\.js$/, target: 'pages/hotel/hotel.js' },
    { test: /^js\/main\.js$/, target: 'pages/hotel/main.js' },

    // Pages - Stay
    { test: /^sub\/private_stay\.html$/, target: 'pages/stay/private_stay.html' },
    { test: /^css\/private_stay\.css$/, target: 'pages/stay/private_stay.css' },
    { test: /^js\/private_stay\.js$/, target: 'pages/stay/private_stay.js' },
    { test: /^sub\/jejustay_life\.html$/, target: 'pages/stay/jejustay_life.html' },
    { test: /^css\/jejustay_life\.css$/, target: 'pages/stay/jejustay_life.css' },
    { test: /^js\/jejustay_life\.js$/, target: 'pages/stay/jejustay_life.js' },
    { test: /^sub\/reservation_check\.html$/, target: 'pages/stay/reservation_check.html' },
    { test: /^css\/reservation\.css$/, target: 'pages/stay/reservation.css' },

    // Pages - Travel
    { test: /^sub\/activities\.html$/, target: 'pages/travel/activities.html' },
    { test: /^css\/activities\.css$/, target: 'pages/travel/activities.css' },
    { test: /^js\/activities\.js$/, target: 'pages/travel/activities.js' },
    { test: /^sub\/esim\.html$/, target: 'pages/travel/esim.html' },
    { test: /^css\/esim\.css$/, target: 'pages/travel/esim.css' },
    { test: /^sub\/travel_guide\.html$/, target: 'pages/travel/travel_guide.html' },
    { test: /^css\/travel_guide\.css$/, target: 'pages/travel/travel_guide.css' },
    { test: /^sub\/travel_tips\.html$/, target: 'pages/travel/travel_tips.html' },
    { test: /^sub\/travel_checklist\.html$/, target: 'pages/travel/travel_checklist.html' },

    // Pages - Deals
    { test: /^sub\/deals\.html$/, target: 'pages/deals/deals.html' },
    { test: /^sub\/deals_member\.html$/, target: 'pages/deals/deals_member.html' },
    { test: /^sub\/deals_partner\.html$/, target: 'pages/deals/deals_partner.html' },
    { test: /^css\/deals\.css$/, target: 'pages/deals/deals.css' },
    { test: /^js\/deals\.js$/, target: 'pages/deals/deals.js' },

    // Pages - CS
    { test: /^sub\/customer_center\.html$/, target: 'pages/cs/customer_center.html' },
    { test: /^css\/customer_center\.css$/, target: 'pages/cs/customer_center.css' },

    // Core
    { test: /^js\/city_data\.js$/, target: 'core/constants/city_data.js' },
    { test: /^js\/lang_data\.js$/, target: 'core/constants/lang_data.js' },
    { test: /^js\/script\.js$/, target: 'core/utils/script.js' },
    { test: /^css\/main\.css$/, target: 'styles/globals.css' },
    { test: /^styles\/globals\.css$/, target: 'styles/globals.css' },

    // Assets - Images/Icons/Videos
    { test: /^assets\/.*\.jfif$/, target: 'assets/images/$1', keepName: true },
    { test: /^assets\/.*\.jpg$/, target: 'assets/images/$1', keepName: true },
    { test: /^assets\/.*\.png$/, target: 'assets/icons/$1', keepName: true },
    { test: /^assets\/.*\.mp4$/, target: 'assets/videos/$1', keepName: true },
    { test: /^assets\/.*\.ico$/, target: 'assets/icons/$1', keepName: true },
    { test: /^favicon\.ico$/, target: 'assets/icons/favicon.ico' },
    
    // Index (keep)
    { test: /^index\.html$/, target: 'index.html' }
];

const pathsMapping = new Map(); // original -> new
const extRename = new Map([
    // Mapping of exact files to new names basically
]);

// Determine new paths
files.forEach(f => {
    let matched = false;
    for (const rule of moveMap) {
        if (rule.test.test(f)) {
            let target;
            if (rule.keepName) {
                target = rule.target.replace('$1', path.basename(f));
            } else {
                target = f.replace(rule.test, rule.target);
            }
            pathsMapping.set(f, target);
            matched = true;
            break;
        }
    }
    if (!matched) {
        // Just move rest back? We will leave unmapped where they are or handle them.
        pathsMapping.set(f, f);
    }
});

function getRelativePath(fromPath, toPath) {
    if (toPath.startsWith('http') || toPath.startsWith('//') || toPath.startsWith('data:')) return toPath;
    
    // Both are paths relative to project root
    const fromDir = path.dirname(fromPath);
    let relPath = path.relative(fromDir, toPath).replace(/\\/g, '/');
    if (!relPath.startsWith('.')) relPath = './' + relPath;
    return relPath;
}

// Map old absolute paths (from root) to new absolute paths (from root)
// Now we update file contents
files.forEach(f => {
    // Only update web files
    if (!f.endsWith('.html') && !f.endsWith('.css') && !f.endsWith('.js')) return;
    
    let content = fs.readFileSync(f, 'utf8');
    const fNewPath = pathsMapping.get(f) || f;
    let changed = false;
    
    // Helper to replace matching paths
    // Search for any existing old path in the text
    for (const [oldP, newP] of pathsMapping.entries()) {
        if (oldP === newP) continue;
        
        // Find how this file originally referenced oldP
        const oldRelPath = getRelativePath(f, oldP);
        const newRelPath = getRelativePath(fNewPath, newP);
        
        // Also find standard variations (no leading ./)
        const oldRelPath2 = oldRelPath.replace(/^\.\//, '');
        const newRelPath2 = newRelPath.replace(/^\.\//, '');

        // And variations with leading /
        const oldAbs = '/' + oldP;
        const newAbs = '/' + newP;

        // Replace all occurrences
        const replaceAll = (text, o, n) => text.split(o).join(n);
        
        let newContent = content;
        newContent = replaceAll(newContent, oldRelPath, newRelPath);
        newContent = replaceAll(newContent, '"' + oldRelPath2 + '"', '"' + newRelPath2 + '"');
        newContent = replaceAll(newContent, "'" + oldRelPath2 + "'", "'" + newRelPath2 + "'");
        newContent = replaceAll(newContent, '`' + oldRelPath2 + '`', '`' + newRelPath2 + '`');
        
        // For CSS url(...)
        newContent = replaceAll(newContent, 'url(' + oldRelPath2 + ')', 'url(' + newRelPath2 + ')');
        newContent = replaceAll(newContent, 'url("' + oldRelPath2 + '")', 'url("' + newRelPath2 + '")');
        newContent = replaceAll(newContent, "url('" + oldRelPath2 + "')", "url('" + newRelPath2 + "')");
        
        // Replace absolute references
        newContent = replaceAll(newContent, '"' + oldAbs + '"', '"' + newAbs + '"');
        newContent = replaceAll(newContent, "'" + oldAbs + "'", "'" + newAbs + "'");

        // Special case: components rename hotel_header -> header.html
        // And mega-menu etc.
        const oldBase = path.basename(oldP);
        const newBase = path.basename(newP);
        if (oldBase !== newBase) {
           newContent = replaceAll(newContent, oldBase, newBase);
        }
        
        if (newContent !== content) {
            content = newContent;
            changed = true;
        }
    }
    
    if (changed) {
        fs.writeFileSync(f, content);
        console.log(`Updated refs in ${f}`);
    }
});

// Now move files
pathsMapping.forEach((newP, oldP) => {
    if (newP !== oldP) {
        const destDir = path.dirname(newP);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        fs.renameSync(oldP, newP);
        console.log(`Moved ${oldP} -> ${newP}`);
    }
});

console.log('Migration Complete.');
