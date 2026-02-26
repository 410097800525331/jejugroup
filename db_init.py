import mysql.connector
import os

def clean_val(v):
    v = v.strip()
    if v.startsWith('[') and v.endswith(']'):
        return v[1:-1]
    return v

env_vars = {}
env_path = 'jeju-web/.env.alwaysdata'
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startsWith('#'): continue
            if '=' in line:
                k, v = line.split('=', 1)
                env_vars[k.strip()] = clean_val(v)

try:
    conn = mysql.connector.connect(
        host=env_vars.get("ALWAYSDATA_DB_HOST", "mysql-jejugroup.alwaysdata.net"),
        user=env_vars.get("ALWAYSDATA_DB_USER", "jejugroup"),
        password=env_vars.get("ALWAYSDATA_DB_PASSWORD"),
        database=env_vars.get("ALWAYSDATA_DB_NAME", "jejugroup_db")
    )
    cursor = conn.cursor()

    cursor.execute("DROP TABLE IF EXISTS member;")
    
    create_table_sql = """
    CREATE TABLE `member` (
          `phone` varchar(30) NOT NULL,
          `name` varchar(20) NOT NULL,
          `gender` char(1) NOT NULL,
          `id` varchar(20) PRIMARY KEY,
          `pw` varchar(255) NOT NULL,
          `email` varchar(30) NOT NULL,
          `zipcode` char(7) NOT NULL,
          `address1` varchar(60) NOT NULL,
          `address2` varchar(60) NOT NULL
    );
    """
    cursor.execute(create_table_sql)
    conn.commit()
    print("Member table created successfully.")

except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals() and conn.is_connected():
        cursor.close()
        conn.close()
