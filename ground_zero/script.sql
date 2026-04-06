--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

-- Started on 2026-02-25 09:33:57

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
-- TOC entry 253 (class 1259 OID 26062)
-- Name: complaint_attachments; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.complaint_attachments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_id uuid NOT NULL,
    file_path text NOT NULL,
    file_name text,
    uploaded_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE hr.complaint_attachments OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 26021)
-- Name: complaint_history; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.complaint_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_id uuid NOT NULL,
    changed_by uuid NOT NULL,
    old_status text,
    new_status text,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE hr.complaint_history OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 26000)
-- Name: complaint_messages; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.complaint_messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    sender_role text NOT NULL,
    body text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT complaint_messages_sender_role_check CHECK ((sender_role = ANY (ARRAY['employee'::text, 'director'::text])))
);


ALTER TABLE hr.complaint_messages OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 26041)
-- Name: complaint_notifications; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.complaint_notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_id uuid NOT NULL,
    recipient_id uuid,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text,
    recipient_user_id uuid
);


ALTER TABLE hr.complaint_notifications OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 25958)
-- Name: complaint_types; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.complaint_types (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE hr.complaint_types OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 25969)
-- Name: complaints; Type: TABLE; Schema: hr; Owner: postgres
--

CREATE TABLE hr.complaints (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    employee_id uuid NOT NULL,
    type_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    priority text DEFAULT 'medium'::text NOT NULL,
    is_anonymous boolean DEFAULT false NOT NULL,
    attachment_path text,
    status text DEFAULT 'pending'::text NOT NULL,
    manager_comment text,
    handled_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at timestamp without time zone,
    due_date timestamp without time zone,
    resolved_at timestamp without time zone,
    satisfaction_rating integer,
    feedback text,
    department_id uuid,
    CONSTRAINT complaints_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
    CONSTRAINT complaints_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text])))
);


ALTER TABLE hr.complaints OWNER TO postgres;

--
-- TOC entry 3592 (class 2606 OID 26070)
-- Name: complaint_attachments complaint_attachments_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_attachments
    ADD CONSTRAINT complaint_attachments_pkey PRIMARY KEY (id);


--
-- TOC entry 3585 (class 2606 OID 26029)
-- Name: complaint_history complaint_history_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_history
    ADD CONSTRAINT complaint_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3582 (class 2606 OID 26009)
-- Name: complaint_messages complaint_messages_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_messages
    ADD CONSTRAINT complaint_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3588 (class 2606 OID 26050)
-- Name: complaint_notifications complaint_notifications_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_notifications
    ADD CONSTRAINT complaint_notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3574 (class 2606 OID 25968)
-- Name: complaint_types complaint_types_code_key; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_types
    ADD CONSTRAINT complaint_types_code_key UNIQUE (code);


--
-- TOC entry 3576 (class 2606 OID 25966)
-- Name: complaint_types complaint_types_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_types
    ADD CONSTRAINT complaint_types_pkey PRIMARY KEY (id);


--
-- TOC entry 3578 (class 2606 OID 25982)
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- TOC entry 3593 (class 1259 OID 26081)
-- Name: idx_complaint_attachments_complaint; Type: INDEX; Schema: hr; Owner: postgres
--

CREATE INDEX idx_complaint_attachments_complaint ON hr.complaint_attachments USING btree (complaint_id, created_at DESC);


--
-- TOC entry 3586 (class 1259 OID 26040)
-- Name: idx_complaint_history_complaint; Type: INDEX; Schema: hr; Owner: postgres
--

CREATE INDEX idx_complaint_history_complaint ON hr.complaint_history USING btree (complaint_id, created_at DESC);


--
-- TOC entry 3583 (class 1259 OID 26020)
-- Name: idx_complaint_messages_complaint; Type: INDEX; Schema: hr; Owner: postgres
--

CREATE INDEX idx_complaint_messages_complaint ON hr.complaint_messages USING btree (complaint_id, created_at);


--
-- TOC entry 3589 (class 1259 OID 26061)
-- Name: idx_complaint_notifications_recipient; Type: INDEX; Schema: hr; Owner: postgres
--

CREATE INDEX idx_complaint_notifications_recipient ON hr.complaint_notifications USING btree (recipient_id, is_read, created_at DESC);


--
-- TOC entry 3590 (class 1259 OID 26087)
-- Name: idx_complaint_notifications_user; Type: INDEX; Schema: hr; Owner: postgres
--

CREATE INDEX idx_complaint_notifications_user ON hr.complaint_notifications USING btree (recipient_user_id, is_read, created_at DESC);


--
-- TOC entry 3579 (class 1259 OID 25998)
-- Name: idx_complaints_employee; Type: INDEX; Schema: hr; Owner: postgres
--

CREATE INDEX idx_complaints_employee ON hr.complaints USING btree (employee_id, created_at DESC);


--
-- TOC entry 3580 (class 1259 OID 25999)
-- Name: idx_complaints_status; Type: INDEX; Schema: hr; Owner: postgres
--

CREATE INDEX idx_complaints_status ON hr.complaints USING btree (status, created_at DESC);


--
-- TOC entry 3605 (class 2606 OID 26071)
-- Name: complaint_attachments complaint_attachments_complaint_id_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_attachments
    ADD CONSTRAINT complaint_attachments_complaint_id_fkey FOREIGN KEY (complaint_id) REFERENCES hr.complaints(id) ON DELETE CASCADE;


--
-- TOC entry 3606 (class 2606 OID 26076)
-- Name: complaint_attachments complaint_attachments_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_attachments
    ADD CONSTRAINT complaint_attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES hr.employees(id);


--
-- TOC entry 3600 (class 2606 OID 26035)
-- Name: complaint_history complaint_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_history
    ADD CONSTRAINT complaint_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES hr.employees(id);


--
-- TOC entry 3601 (class 2606 OID 26030)
-- Name: complaint_history complaint_history_complaint_id_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_history
    ADD CONSTRAINT complaint_history_complaint_id_fkey FOREIGN KEY (complaint_id) REFERENCES hr.complaints(id) ON DELETE CASCADE;


--
-- TOC entry 3598 (class 2606 OID 26010)
-- Name: complaint_messages complaint_messages_complaint_id_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_messages
    ADD CONSTRAINT complaint_messages_complaint_id_fkey FOREIGN KEY (complaint_id) REFERENCES hr.complaints(id) ON DELETE CASCADE;


--
-- TOC entry 3599 (class 2606 OID 26015)
-- Name: complaint_messages complaint_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_messages
    ADD CONSTRAINT complaint_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES hr.employees(id) ON DELETE CASCADE;


--
-- TOC entry 3602 (class 2606 OID 26051)
-- Name: complaint_notifications complaint_notifications_complaint_id_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_notifications
    ADD CONSTRAINT complaint_notifications_complaint_id_fkey FOREIGN KEY (complaint_id) REFERENCES hr.complaints(id) ON DELETE CASCADE;


--
-- TOC entry 3603 (class 2606 OID 26056)
-- Name: complaint_notifications complaint_notifications_recipient_id_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_notifications
    ADD CONSTRAINT complaint_notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES hr.employees(id);


--
-- TOC entry 3604 (class 2606 OID 26082)
-- Name: complaint_notifications complaint_notifications_recipient_user_id_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaint_notifications
    ADD CONSTRAINT complaint_notifications_recipient_user_id_fkey FOREIGN KEY (recipient_user_id) REFERENCES hr.users(id);


--
-- TOC entry 3594 (class 2606 OID 26088)
-- Name: complaints complaints_department_id_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaints
    ADD CONSTRAINT complaints_department_id_fkey FOREIGN KEY (department_id) REFERENCES hr.departments(id);


--
-- TOC entry 3595 (class 2606 OID 25983)
-- Name: complaints complaints_employee_id_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaints
    ADD CONSTRAINT complaints_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES hr.employees(id) ON DELETE CASCADE;


--
-- TOC entry 3596 (class 2606 OID 25993)
-- Name: complaints complaints_handled_by_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaints
    ADD CONSTRAINT complaints_handled_by_fkey FOREIGN KEY (handled_by) REFERENCES hr.employees(id);


--
-- TOC entry 3597 (class 2606 OID 25988)
-- Name: complaints complaints_type_id_fkey; Type: FK CONSTRAINT; Schema: hr; Owner: postgres
--

ALTER TABLE ONLY hr.complaints
    ADD CONSTRAINT complaints_type_id_fkey FOREIGN KEY (type_id) REFERENCES hr.complaint_types(id) ON DELETE RESTRICT;


-- Completed on 2026-02-25 09:33:58

--
-- PostgreSQL database dump complete
--

