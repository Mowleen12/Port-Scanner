import streamlit as st
import mysql.connector
import pandas as pd
from datetime import datetime

# Database connection
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="hr"
    )

# Fetch employee data
def get_employees():
    conn = get_connection()
    query = "SELECT employee_id, first_name, last_name, department_id FROM employees"
    cursor = conn.cursor()
    cursor.execute(query)
    data = cursor.fetchall()
    df = pd.DataFrame(data, columns=[desc[0] for desc in cursor.description])
    conn.close()
    return df

# Insert new employee
def add_employee(first_name, last_name, department_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO employees (first_name, last_name, department_id) VALUES (%s, %s, %s)", 
                   (first_name, last_name, department_id))
    conn.commit()
    conn.close()
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Update employee
def update_employee(employee_id, first_name, last_name, department_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE employees SET first_name=%s, last_name=%s, department_id=%s WHERE employee_id=%s", 
                   (first_name, last_name, department_id, employee_id))
    conn.commit()
    conn.close()
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Delete employee
def delete_employee(employee_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM employees WHERE employee_id=%s", (employee_id,))
    conn.commit()
    conn.close()
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Streamlit UI
st.set_page_config(page_title="Employee Management System", layout="wide")

st.markdown(
    """
    <style>
        .stApp {
            background-color: #1e1e1e;
            color: #ffffff;
        }
        .big-font {
            font-size:40px !important;
            color: #4caf50;
            font-weight: bold;
            text-align: center;
        }
        .stButton > button {
            background-color: #4caf50;
            color: white;
            border-radius: 10px;
            padding: 15px;
            width: 100%;
        }
        .spacer {
            margin-bottom: 20px;
        }
    </style>
    """,
    unsafe_allow_html=True
)

st.markdown('<p class="big-font">Employee Management System</p>', unsafe_allow_html=True)

st.markdown("<div class='spacer'></div>", unsafe_allow_html=True)

# Employee Form
st.subheader("Add / Update Employee")

col1, col2, col3, col4 = st.columns(4)
with col1:
    employee_id = st.number_input("Employee ID (For Update Only)", min_value=0, value=0)
with col2:
    first_name = st.text_input("First Name")
with col3:
    last_name = st.text_input("Last Name")
with col4:
    department_id = st.number_input("Department ID", min_value=1)

st.markdown("<div class='spacer'></div>", unsafe_allow_html=True)

time_of_action = ""
colA, colB, colC = st.columns(3)
with colA:
    if st.button("Add Employee"):
        time_of_action = add_employee(first_name, last_name, department_id)
        st.success(f"Employee added successfully at {time_of_action}")
with colB:
    if st.button("Update Employee"):
        time_of_action = update_employee(employee_id, first_name, last_name, department_id)
        st.success(f"Employee updated successfully at {time_of_action}")
with colC:
    if st.button("Delete Employee"):
        time_of_action = delete_employee(employee_id)
        st.success(f"Employee deleted successfully at {time_of_action}")

st.markdown("<div class='spacer'></div>", unsafe_allow_html=True)

if st.checkbox("Show Employee List"):
    st.subheader("Employee List")
    df = get_employees()
    st.dataframe(df, use_container_width=True)

st.markdown("<br><hr><center>Made with ❤️ using Streamlit</center>", unsafe_allow_html=True)
st.markdown("<center>© Created by Mowleen Armstrong</center>", unsafe_allow_html=True)
