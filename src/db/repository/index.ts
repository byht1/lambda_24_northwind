// CUSTOMER
export * from './customers/CustomerRepository';
export { TCustomersAllRes, TCustomersOneByIdRes, TCustomersFindRes } from './customers/type';

// PRODUCTS
export * from './products/ProductsRepository';
export { TProductsAllRes, TProductsOneByIdRes, TProductsFindRes } from './products/type';

// EMPLOYEES
export * from './employees/EmployeesRepository';
export { TEmployeesAllRes, TEmployeesOneByIdRes } from './employees/type';

// ORDERS
export * from './orders/OrdersRepository';
export { TOrdersAllRes, TOrdersOneByIdRes, TOrdersOneByIdResponse } from './orders/type';

// ORDER_DETAILS
export * from './orderDetails/OrderDetailsRepository';
export { TOrdersDetailsByIdRes, TOrderDetailsByIdResponse } from './orderDetails/type';

// SUPPLIES
export * from './supplies/SuppliesRepository';
export { TSuppliesAllRes, TSuppliesOneByIdRes } from './supplies/type';
