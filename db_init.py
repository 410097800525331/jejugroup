import mysql.connector

try:
    conn = mysql.connector.connect(
        host="mysql-jejugroup.alwaysdata.net",
        user="jejugroup",
        password="shmajo0821!",
        database="jejugroup_db"
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
