CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar NOT NULL,
	"company_name" varchar,
	"contact_name" varchar,
	"contact_title" varchar NOT NULL,
	"address" varchar,
	"city" varchar,
	"region" varchar,
	"postal_code" varchar,
	"country" varchar NOT NULL,
	"phone" varchar,
	"fax" varchar
);

CREATE TABLE IF NOT EXISTS "employee_territories" (
	"employee_id" integer NOT NULL,
	"territory_id" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"title" varchar,
	"title_of_courtesy" varchar,
	"birth_date" varchar,
	"hire_date" varchar,
	"address" varchar,
	"city" varchar,
	"region" varchar,
	"postal_code" varchar,
	"country" varchar,
	"home_phone" varchar,
	"extension" integer,
	"notes" varchar,
	"reports_to" integer
);

CREATE TABLE IF NOT EXISTS "order_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" serial NOT NULL,
	"product_id" serial NOT NULL,
	"unit_price" numeric NOT NULL,
	"quantity" integer NOT NULL,
	"discount" numeric NOT NULL
);

CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" serial NOT NULL,
	"employee_id" serial NOT NULL,
	"order_date" varchar NOT NULL,
	"required_date" varchar NOT NULL,
	"shipped_date" varchar,
	"ship_via" integer NOT NULL,
	"freight" numeric NOT NULL,
	"ship_name" varchar NOT NULL,
	"ship_address" varchar NOT NULL,
	"ship_city" varchar NOT NULL,
	"ship_region" varchar,
	"ship_postal_code" varchar,
	"ship_country" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" serial NOT NULL,
	"product_name" varchar NOT NULL,
	"supplier_id" serial NOT NULL,
	"category_id" serial NOT NULL,
	"quantity_per_unit" varchar NOT NULL,
	"unit_price" numeric NOT NULL,
	"units_in_stock" integer NOT NULL,
	"units_on_order" integer NOT NULL,
	"reorder_level" integer NOT NULL,
	"discontinued" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"region_id" serial NOT NULL,
	"region_description" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "shippers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipper_id" serial NOT NULL,
	"company_name" varchar NOT NULL,
	"phone" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "supplies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" serial NOT NULL,
	"company_name" varchar NOT NULL,
	"contact_name" varchar NOT NULL,
	"contact_title" varchar NOT NULL,
	"address" varchar NOT NULL,
	"city" varchar NOT NULL,
	"region" varchar,
	"postal_code" varchar NOT NULL,
	"country" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"fax" varchar,
	"home_page" varchar
);

CREATE TABLE IF NOT EXISTS "territories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"territory_id" serial NOT NULL,
	"region_id" serial NOT NULL,
	"territory_description" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" serial NOT NULL,
	"category_name" varchar NOT NULL,
	"description" varchar NOT NULL
);
