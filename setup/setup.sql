--
-- PostgreSQL database dump
--

-- Dumped from database version 14.16 (Homebrew)
-- Dumped by pg_dump version 14.16 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: YOUR_ROLE
--

CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.cart OWNER TO YOUR_ROLE;

--
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: YOUR_ROLE
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_id_seq OWNER TO YOUR_ROLE;

--
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: YOUR_ROLE
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: YOUR_ROLE
--

CREATE TABLE public.cart_items (
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO YOUR_ROLE;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: YOUR_ROLE
--

CREATE TABLE public.order_items (
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.order_items OWNER TO YOUR_ROLE;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: YOUR_ROLE
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total numeric NOT NULL,
    status character varying NOT NULL
);


ALTER TABLE public.orders OWNER TO YOUR_ROLE;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: YOUR_ROLE
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO YOUR_ROLE;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: YOUR_ROLE
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: YOUR_ROLE
--

CREATE TABLE public.product_reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer NOT NULL,
    comment character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT product_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.product_reviews OWNER TO YOUR_ROLE;

--
-- Name: product_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: YOUR_ROLE
--

CREATE SEQUENCE public.product_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_reviews_id_seq OWNER TO YOUR_ROLE;

--
-- Name: product_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: YOUR_ROLE
--

ALTER SEQUENCE public.product_reviews_id_seq OWNED BY public.product_reviews.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: YOUR_ROLE
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying NOT NULL,
    price numeric NOT NULL,
    stock integer NOT NULL
);


ALTER TABLE public.products OWNER TO YOUR_ROLE;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: YOUR_ROLE
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO YOUR_ROLE;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: YOUR_ROLE
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: YOUR_ROLE
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.users OWNER TO YOUR_ROLE;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: YOUR_ROLE
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO YOUR_ROLE;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: YOUR_ROLE
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product_reviews id; Type: DEFAULT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.product_reviews ALTER COLUMN id SET DEFAULT nextval('public.product_reviews_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (cart_id, product_id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: cart cart_user_id_key; Type: CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_key UNIQUE (user_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_id, product_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: orders_userid; Type: INDEX; Schema: public; Owner: YOUR_ROLE
--

CREATE INDEX orders_userid ON public.orders USING btree (user_id);


--
-- Name: product_name; Type: INDEX; Schema: public; Owner: YOUR_ROLE
--

CREATE INDEX product_name ON public.products USING btree (name);


--
-- Name: product_reviews_rating; Type: INDEX; Schema: public; Owner: YOUR_ROLE
--

CREATE INDEX product_reviews_rating ON public.product_reviews USING btree (rating);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: YOUR_ROLE
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: YOUR_ROLE
--

GRANT ALL ON SCHEMA public TO YOUR_API_ROLE;


--
-- Name: TABLE cart; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cart TO YOUR_API_ROLE;


--
-- Name: SEQUENCE cart_id_seq; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,USAGE ON SEQUENCE public.cart_id_seq TO YOUR_API_ROLE;


--
-- Name: TABLE cart_items; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cart_items TO YOUR_API_ROLE;


--
-- Name: TABLE order_items; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.order_items TO YOUR_API_ROLE;


--
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.orders TO YOUR_API_ROLE;


--
-- Name: SEQUENCE orders_id_seq; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,USAGE ON SEQUENCE public.orders_id_seq TO YOUR_API_ROLE;


--
-- Name: TABLE product_reviews; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.product_reviews TO YOUR_API_ROLE;


--
-- Name: SEQUENCE product_reviews_id_seq; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,USAGE ON SEQUENCE public.product_reviews_id_seq TO YOUR_API_ROLE;


--
-- Name: TABLE products; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.products TO YOUR_API_ROLE;


--
-- Name: SEQUENCE products_id_seq; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,USAGE ON SEQUENCE public.products_id_seq TO YOUR_API_ROLE;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO YOUR_API_ROLE;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: YOUR_ROLE
--

GRANT SELECT,USAGE ON SEQUENCE public.users_id_seq TO YOUR_API_ROLE;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: YOUR_ROLE
--

ALTER DEFAULT PRIVILEGES FOR ROLE YOUR_ROLE IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES  TO YOUR_API_ROLE;


--
-- PostgreSQL database dump complete
--

