import  {db}  from "../config/payroll_config.js";

// here i will be creating a function that fetches the payroll informations and returns an error and a message if the api does not get.

export const getPayroll = async () => {
  let [rows] = await db.query(`SELECT * FROM payroll`)
  return rows;

};

export const getPayrollData = async () => {
  const query = `
  SELECT 
  e.employee_id,
  COALESCE(i.name, e.name) AS name,
  i.position,
  i.department,
  i.salary AS base_salary,
  p.hours_worked,
  p.leave_deductions,
  p.final_salary
  FROM payroll p
  INNER JOIN employees e ON p.employee_id = e.employee_id
  LEFT JOIN employee_information i ON i.employee_id = e.employee_id;
  `;
  const [rows] = await db.query(query);
  return rows;
};


export const newPayrollData = async (employee_id, hours_worked, leave_deductions, final_salary) => {
  const query = `
  INSERT INTO payroll (employee_id, hours_worked, leave_deductions, final_salary)
  VALUES (?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE 
    hours_worked = VALUES(hours_worked),
    leave_deductions = VALUES(leave_deductions),
    final_salary = VALUES(final_salary)
  
`;
  const [result] = await db.query(query, [employee_id, hours_worked, leave_deductions, final_salary]);
  return result;
};

export const getSinglePayrollData = async (id) => {
  const query = `
  SELECT 
  e.employee_id,
  COALESCE(i.name, e.name) AS name,
  i.position,
  i.department,
  i.salary AS base_salary,
  p.hours_worked,
  p.leave_deductions,
  p.final_salary
  FROM payroll p
  INNER JOIN employees e ON p.employee_id = e.employee_id
  LEFT JOIN employee_information i ON i.employee_id = e.employee_id
  WHERE p.employee_id = ?;
  `;
  const [rows] = await db.query(query, [id]);
  return rows[0];
};
