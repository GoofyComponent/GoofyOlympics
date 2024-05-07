--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4 (Debian 13.4-4.pgdg110+1)
-- Dumped by pg_dump version 13.14

-- Started on 2024-05-05 22:52:06 UTC

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
-- TOC entry 203 (class 1259 OID 16440)
-- Name: noc_regions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.noc_regions (
    id integer NOT NULL,
    noc character varying(255),
    region character varying(255),
    notes character varying(255)
);


ALTER TABLE public.noc_regions OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16438)
-- Name: noc_regions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.noc_regions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.noc_regions_id_seq OWNER TO postgres;

--
-- TOC entry 2999 (class 0 OID 0)
-- Dependencies: 202
-- Name: noc_regions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.noc_regions_id_seq OWNED BY public.noc_regions.id;


--
-- TOC entry 2859 (class 2604 OID 16443)
-- Name: noc_regions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.noc_regions ALTER COLUMN id SET DEFAULT nextval('public.noc_regions_id_seq'::regclass);


--
-- TOC entry 2993 (class 0 OID 16440)
-- Dependencies: 203
-- Data for Name: noc_regions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (1, 'AFG', 'Afghanistan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (2, 'AHO', 'Curacao', 'Netherlands Antilles');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (3, 'ALB', 'Albania', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (4, 'ALG', 'Algeria', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (5, 'AND', 'Andorra', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (6, 'ANG', 'Angola', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (7, 'ANT', 'Antigua', 'Antigua and Barbuda');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (8, 'ANZ', 'Australia', 'Australasia');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (9, 'ARG', 'Argentina', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (10, 'ARM', 'Armenia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (11, 'ARU', 'Aruba', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (12, 'ASA', 'American Samoa', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (13, 'AUS', 'Australia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (14, 'AUT', 'Austria', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (15, 'AZE', 'Azerbaijan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (16, 'BAH', 'Bahamas', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (17, 'BAN', 'Bangladesh', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (18, 'BAR', 'Barbados', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (19, 'BDI', 'Burundi', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (20, 'BEL', 'Belgium', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (21, 'BEN', 'Benin', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (22, 'BER', 'Bermuda', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (23, 'BHU', 'Bhutan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (24, 'BIH', 'Bosnia and Herzegovina', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (25, 'BIZ', 'Belize', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (26, 'BLR', 'Belarus', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (27, 'BOH', 'Czech Republic', 'Bohemia');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (28, 'BOL', 'Boliva', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (29, 'BOT', 'Botswana', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (30, 'BRA', 'Brazil', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (31, 'BRN', 'Bahrain', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (32, 'BRU', 'Brunei', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (33, 'BUL', 'Bulgaria', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (34, 'BUR', 'Burkina Faso', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (35, 'CAF', 'Central African Republic', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (36, 'CAM', 'Cambodia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (37, 'CAN', 'Canada', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (38, 'CAY', 'Cayman Islands', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (39, 'CGO', 'Republic of Congo', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (40, 'CHA', 'Chad', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (41, 'CHI', 'Chile', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (42, 'CHN', 'China', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (43, 'CIV', 'Ivory Coast', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (44, 'CMR', 'Cameroon', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (45, 'COD', 'Democratic Republic of the Congo', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (46, 'COK', 'Cook Islands', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (47, 'COL', 'Colombia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (48, 'COM', 'Comoros', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (49, 'CPV', 'Cape Verde', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (50, 'CRC', 'Costa Rica', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (51, 'CRO', 'Croatia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (52, 'CRT', 'Greece', 'Crete');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (53, 'CUB', 'Cuba', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (54, 'CYP', 'Cyprus', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (55, 'CZE', 'Czech Republic', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (56, 'DEN', 'Denmark', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (57, 'DJI', 'Djibouti', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (58, 'DMA', 'Dominica', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (59, 'DOM', 'Dominican Republic', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (60, 'ECU', 'Ecuador', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (61, 'EGY', 'Egypt', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (62, 'ERI', 'Eritrea', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (63, 'ESA', 'El Salvador', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (64, 'ESP', 'Spain', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (65, 'EST', 'Estonia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (66, 'ETH', 'Ethiopia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (67, 'EUN', 'Russia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (68, 'FIJ', 'Fiji', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (69, 'FIN', 'Finland', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (70, 'FRA', 'France', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (71, 'FRG', 'Germany', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (72, 'FSM', 'Micronesia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (73, 'GAB', 'Gabon', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (74, 'GAM', 'Gambia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (75, 'GBR', 'UK', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (76, 'GBS', 'Guinea-Bissau', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (77, 'GDR', 'Germany', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (78, 'GEO', 'Georgia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (79, 'GEQ', 'Equatorial Guinea', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (80, 'GER', 'Germany', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (81, 'GHA', 'Ghana', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (82, 'GRE', 'Greece', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (83, 'GRN', 'Grenada', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (84, 'GUA', 'Guatemala', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (85, 'GUI', 'Guinea', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (86, 'GUM', 'Guam', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (87, 'GUY', 'Guyana', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (88, 'HAI', 'Haiti', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (89, 'HKG', 'China', 'Hong Kong');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (90, 'HON', 'Honduras', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (91, 'HUN', 'Hungary', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (92, 'INA', 'Indonesia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (93, 'IND', 'India', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (94, 'IOA', 'Individual Olympic Athletes', 'Individual Olympic Athletes');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (95, 'IRI', 'Iran', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (96, 'IRL', 'Ireland', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (97, 'IRQ', 'Iraq', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (98, 'ISL', 'Iceland', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (99, 'ISR', 'Israel', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (100, 'ISV', 'Virgin Islands, US', 'Virgin Islands');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (101, 'ITA', 'Italy', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (102, 'IVB', 'Virgin Islands, British', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (103, 'JAM', 'Jamaica', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (104, 'JOR', 'Jordan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (105, 'JPN', 'Japan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (106, 'KAZ', 'Kazakhstan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (107, 'KEN', 'Kenya', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (108, 'KGZ', 'Kyrgyzstan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (109, 'KIR', 'Kiribati', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (110, 'KOR', 'South Korea', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (111, 'KOS', 'Kosovo', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (112, 'KSA', 'Saudi Arabia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (113, 'KUW', 'Kuwait', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (114, 'LAO', 'Laos', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (115, 'LAT', 'Latvia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (116, 'LBA', 'Libya', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (117, 'LBR', 'Liberia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (118, 'LCA', 'Saint Lucia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (119, 'LES', 'Lesotho', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (120, 'LIB', 'Lebanon', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (121, 'LIE', 'Liechtenstein', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (122, 'LTU', 'Lithuania', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (123, 'LUX', 'Luxembourg', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (124, 'MAD', 'Madagascar', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (125, 'MAL', 'Malaysia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (126, 'MAR', 'Morocco', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (127, 'MAS', 'Malaysia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (128, 'MAW', 'Malawi', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (129, 'MDA', 'Moldova', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (130, 'MDV', 'Maldives', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (131, 'MEX', 'Mexico', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (132, 'MGL', 'Mongolia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (133, 'MHL', 'Marshall Islands', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (134, 'MKD', 'Macedonia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (135, 'MLI', 'Mali', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (136, 'MLT', 'Malta', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (137, 'MNE', 'Montenegro', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (138, 'MON', 'Monaco', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (139, 'MOZ', 'Mozambique', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (140, 'MRI', 'Mauritius', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (141, 'MTN', 'Mauritania', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (142, 'MYA', 'Myanmar', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (143, 'NAM', 'Namibia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (144, 'NBO', 'Malaysia', 'North Borneo');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (145, 'NCA', 'Nicaragua', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (146, 'NED', 'Netherlands', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (147, 'NEP', 'Nepal', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (148, 'NFL', 'Canada', 'Newfoundland');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (149, 'NGR', 'Nigeria', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (150, 'NIG', 'Niger', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (151, 'NOR', 'Norway', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (152, 'NRU', 'Nauru', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (153, 'NZL', 'New Zealand', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (154, 'OMA', 'Oman', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (155, 'PAK', 'Pakistan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (156, 'PAN', 'Panama', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (157, 'PAR', 'Paraguay', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (158, 'PER', 'Peru', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (159, 'PHI', 'Philippines', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (160, 'PLE', 'Palestine', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (161, 'PLW', 'Palau', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (162, 'PNG', 'Papua New Guinea', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (163, 'POL', 'Poland', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (164, 'POR', 'Portugal', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (165, 'PRK', 'North Korea', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (166, 'PUR', 'Puerto Rico', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (167, 'QAT', 'Qatar', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (168, 'RHO', 'Zimbabwe', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (169, 'ROT', 'NA', 'Refugee Olympic Team');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (170, 'ROU', 'Romania', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (171, 'RSA', 'South Africa', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (172, 'RUS', 'Russia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (173, 'RWA', 'Rwanda', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (174, 'SAA', 'Germany', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (175, 'SAM', 'Samoa', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (176, 'SCG', 'Serbia', 'Serbia and Montenegro');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (177, 'SEN', 'Senegal', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (178, 'SEY', 'Seychelles', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (179, 'SIN', 'Singapore', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (180, 'SKN', 'Saint Kitts', 'Turks and Caicos Islands');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (181, 'SLE', 'Sierra Leone', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (182, 'SLO', 'Slovenia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (183, 'SMR', 'San Marino', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (184, 'SOL', 'Solomon Islands', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (185, 'SOM', 'Somalia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (186, 'SRB', 'Serbia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (187, 'SRI', 'Sri Lanka', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (188, 'SSD', 'South Sudan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (189, 'STP', 'Sao Tome and Principe', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (190, 'SUD', 'Sudan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (191, 'SUI', 'Switzerland', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (192, 'SUR', 'Suriname', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (193, 'SVK', 'Slovakia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (194, 'SWE', 'Sweden', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (195, 'SWZ', 'Swaziland', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (196, 'SYR', 'Syria', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (197, 'TAN', 'Tanzania', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (198, 'TCH', 'Czech Republic', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (199, 'TGA', 'Tonga', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (200, 'THA', 'Thailand', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (201, 'TJK', 'Tajikistan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (202, 'TKM', 'Turkmenistan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (203, 'TLS', 'Timor-Leste', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (204, 'TOG', 'Togo', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (205, 'TPE', 'Taiwan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (206, 'TTO', 'Trinidad', 'Trinidad and Tobago');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (207, 'TUN', 'Tunisia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (208, 'TUR', 'Turkey', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (209, 'TUV', 'NA', 'Tuvalu');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (210, 'UAE', 'United Arab Emirates', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (211, 'UAR', 'Syria', 'United Arab Republic');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (212, 'UGA', 'Uganda', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (213, 'UKR', 'Ukraine', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (214, 'UNK', 'NA', 'Unknown');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (215, 'URS', 'Russia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (216, 'URU', 'Uruguay', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (217, 'USA', 'USA', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (218, 'UZB', 'Uzbekistan', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (219, 'VAN', 'Vanuatu', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (220, 'VEN', 'Venezuela', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (221, 'VIE', 'Vietnam', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (222, 'VIN', 'Saint Vincent', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (223, 'VNM', 'Vietnam', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (224, 'WIF', 'Trinidad', 'West Indies Federation');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (225, 'YAR', 'Yemen', 'North Yemen');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (226, 'YEM', 'Yemen', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (227, 'YMD', 'Yemen', 'South Yemen');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (228, 'YUG', 'Serbia', 'Yugoslavia');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (229, 'ZAM', 'Zambia', '');
INSERT INTO public.noc_regions (id, noc, region, notes) VALUES (230, 'ZIM', 'Zimbabwe', '');


--
-- TOC entry 3000 (class 0 OID 0)
-- Dependencies: 202
-- Name: noc_regions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.noc_regions_id_seq', 230, true);


--
-- TOC entry 2861 (class 2606 OID 16448)
-- Name: noc_regions noc_regions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.noc_regions
    ADD CONSTRAINT noc_regions_pkey PRIMARY KEY (id);


-- Completed on 2024-05-05 22:52:06 UTC

--
-- PostgreSQL database dump complete
--

