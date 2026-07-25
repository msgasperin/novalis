/*
SQLyog Community v13.3.1 (64 bit)
MySQL - 8.4.3 : Database - sagm_lis
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sagm_lis` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `sagm_lis`;

/*Table structure for table `2_cat_pruebas` */

DROP TABLE IF EXISTS `2_cat_pruebas`;

CREATE TABLE `2_cat_pruebas` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `subestudio_id` int unsigned NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `unidad_medida` varchar(30) DEFAULT NULL,
  `tipo_resultado` enum('NUMERICO','TEXTO','ALFANUMERICO') NOT NULL DEFAULT 'NUMERICO',
  `orden_visual` int DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_prueba_subestudio` (`subestudio_id`),
  CONSTRAINT `fk_prueba_subestudio` FOREIGN KEY (`subestudio_id`) REFERENCES `2_cat_subestudios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `2_cat_pruebas` */

/*Table structure for table `2_cat_subestudios` */

DROP TABLE IF EXISTS `2_cat_subestudios`;

CREATE TABLE `2_cat_subestudios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `estudio_id` int unsigned NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `orden_visual` int DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_subestudio_estudio` (`estudio_id`),
  CONSTRAINT `fk_subestudio_estudio` FOREIGN KEY (`estudio_id`) REFERENCES `cat_estudios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `2_cat_subestudios` */

/*Table structure for table `2_cat_valores_referencia` */

DROP TABLE IF EXISTS `2_cat_valores_referencia`;

CREATE TABLE `2_cat_valores_referencia` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `prueba_id` int unsigned NOT NULL,
  `sexo` enum('MASCULINO','FEMENINO','AMBOS') NOT NULL DEFAULT 'AMBOS',
  `edad_minima_dias` int unsigned DEFAULT '0',
  `edad_maxima_dias` int unsigned DEFAULT '43800',
  `minimo_val` decimal(12,4) DEFAULT NULL,
  `maximo_val` decimal(12,4) DEFAULT NULL,
  `texto_referencia` text,
  PRIMARY KEY (`id`),
  KEY `fk_valores_prueba` (`prueba_id`),
  CONSTRAINT `fk_valores_prueba` FOREIGN KEY (`prueba_id`) REFERENCES `2_cat_pruebas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `2_cat_valores_referencia` */

/*Table structure for table `2_datos_medico` */

DROP TABLE IF EXISTS `2_datos_medico`;

CREATE TABLE `2_datos_medico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cliente_fk` int NOT NULL,
  `cedula_profesional` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `2_datos_medico` */

/*Table structure for table `2_orden_resultados` */

DROP TABLE IF EXISTS `2_orden_resultados`;

CREATE TABLE `2_orden_resultados` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `orden_detalle_id` int unsigned NOT NULL,
  `prueba_id` int unsigned NOT NULL,
  `valor_resultado` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `observaciones` text,
  `usuario_capturo_id` int unsigned NOT NULL,
  `usuario_valido_id` int unsigned DEFAULT NULL,
  `estatus_resultado` enum('PENDIENTE','CAPTURADO','VALIDADO') NOT NULL DEFAULT 'PENDIENTE',
  `fecha_captura` timestamp NULL DEFAULT NULL,
  `fecha_validacion` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_detalle_prueba` (`orden_detalle_id`,`prueba_id`),
  KEY `fk_resultado_prueba` (`prueba_id`),
  KEY `fk_resultado_usuario_cap` (`usuario_capturo_id`),
  KEY `fk_resultado_usuario_val` (`usuario_valido_id`),
  CONSTRAINT `fk_resultado_detalle` FOREIGN KEY (`orden_detalle_id`) REFERENCES `orden_detalles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resultado_prueba` FOREIGN KEY (`prueba_id`) REFERENCES `2_cat_pruebas` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_resultado_usuario_cap` FOREIGN KEY (`usuario_capturo_id`) REFERENCES `cat_usuarios` (`id_usuario`) ON DELETE RESTRICT,
  CONSTRAINT `fk_resultado_usuario_val` FOREIGN KEY (`usuario_valido_id`) REFERENCES `cat_usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `2_orden_resultados` */

/*Table structure for table `2_paquete_estudios` */

DROP TABLE IF EXISTS `2_paquete_estudios`;

CREATE TABLE `2_paquete_estudios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `paquete_id` int unsigned NOT NULL,
  `estudio_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_paquete_estudio` (`paquete_id`,`estudio_id`),
  KEY `fk_estudio_hijo` (`estudio_id`),
  CONSTRAINT `fk_estudio_hijo` FOREIGN KEY (`estudio_id`) REFERENCES `cat_estudios` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_paquete_padre` FOREIGN KEY (`paquete_id`) REFERENCES `cat_estudios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `2_paquete_estudios` */

/*Table structure for table `bitacora` */

DROP TABLE IF EXISTS `bitacora`;

CREATE TABLE `bitacora` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `usuario` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `accion` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `id_tracking` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `puerto` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `proveedor` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_bitacora_usuario_fecha` (`id_usuario`,`fecha`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

/*Data for the table `bitacora` */

insert  into `bitacora`(`id`,`id_usuario`,`usuario`,`fecha`,`accion`,`id_tracking`,`ip`,`puerto`,`proveedor`) values 
(1,1,'Miguel Ángel Sáinz Gasperín','2026-07-03 10:49:32','Inicio de sesión','1','127.0.0.1','56187','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(2,1,'Miguel Ángel Sáinz Gasperín','2026-07-03 14:26:33','Paciente registrado: Romina','1','127.0.0.1','51234','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(3,1,'Miguel Ángel Sáinz Gasperín','2026-07-03 14:38:47','Paciente modificado: Romina.','1','127.0.0.1','61021','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(4,1,'Miguel Ángel Sáinz Gasperín','2026-07-03 14:39:06','Paciente modificado: Romina','1','127.0.0.1','61034','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(5,1,'Miguel Ángel Sáinz Gasperín','2026-07-03 14:39:36','Paciente eliminado: Romina López Rodríguez','1','127.0.0.1','61057','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(6,1,'Miguel Ángel Sáinz Gasperín','2026-07-03 17:37:42','Credenciales actuaalizadas del paciente: Romina','1','127.0.0.1','55600','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(7,1,'Miguel Ángel Sáinz Gasperín','2026-07-03 17:41:35','Credenciales actuaalizadas del paciente: Romina','1','127.0.0.1','60022','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(8,1,'Miguel Ángel Sáinz Gasperín','2026-07-03 17:41:42','Credenciales actuaalizadas del paciente: Romina','1','127.0.0.1','60034','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(9,1,'Miguel Ángel Sáinz Gasperín','2026-07-06 13:32:13','Inicio de sesión','1','127.0.0.1','60746','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(10,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 16:30:31','Inicio de sesión','1','127.0.0.1','63474','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(11,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 16:43:36','Paciente registrado: Miranda','2','127.0.0.1','60670','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(12,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 16:44:18','Paciente registrado: Concepción','3','127.0.0.1','60685','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(13,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 16:46:08','Paciente registrado: Mariel','4','127.0.0.1','52047','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(14,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 16:47:04','Paciente registrado: José Luis','5','127.0.0.1','54066','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(15,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:25:07','Paciente registrado: Miguel Ángel','6','127.0.0.1','59099','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(16,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:26:42','Paciente registrado: Daniel','7','127.0.0.1','63192','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(17,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:29:25','Paciente registrado: José Manuel','8','127.0.0.1','59692','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(18,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:30:40','Paciente registrado: Jonathan','9','127.0.0.1','62785','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(19,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:33:47','Paciente registrado: Mónica','10','127.0.0.1','52784','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(20,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:37:49','Paciente registrado: Gustavo','11','127.0.0.1','56937','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(21,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:40:57','Paciente registrado: Benjamín','12','127.0.0.1','59171','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(22,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:48:00','Paciente registrado: Eloisa','13','127.0.0.1','50412','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(23,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:48:56','Paciente registrado: Berenice','14','127.0.0.1','50441','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(24,1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:51:56','Paciente registrado: Alejandra','15','127.0.0.1','63247','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(25,1,'Miguel Ángel Sáinz Gasperín','2026-07-17 10:15:55','Inicio de sesión','1','127.0.0.1','53122','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(26,1,'Miguel Ángel Sáinz Gasperín','2026-07-17 10:49:13','Convenio registrado: Centro Médico Perote','7','127.0.0.1','57523','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(27,1,'Miguel Ángel Sáinz Gasperín','2026-07-17 10:50:47','Convenio modificado: Centro Médico Perote.','7','127.0.0.1','57556','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(28,1,'Miguel Ángel Sáinz Gasperín','2026-07-17 13:31:13','Actualización de generales de la lista de precios: Precio empresas','1','127.0.0.1','55487','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(29,1,'Miguel Ángel Sáinz Gasperín','2026-07-23 16:18:24','Inicio de sesión','1','127.0.0.1','58402','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(30,1,'Miguel Ángel Sáinz Gasperín','2026-07-23 19:02:01','Inicio de sesión','1','127.0.0.1','54260','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(31,1,'Miguel Ángel Sáinz Gasperín','2026-07-23 19:06:27','Estudio modificado: Biometría Hemática Completa','1','127.0.0.1','50119','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(32,1,'Miguel Ángel Sáinz Gasperín','2026-07-23 19:10:33','Estudio registrado: Perfíl Masculino','5','127.0.0.1','55466','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(33,1,'Miguel Ángel Sáinz Gasperín','2026-07-23 19:11:13','Estudio modificado: Perfil de Lípidos.','4','127.0.0.1','54092','mozilla/5.0 (windows nt 10.0; win64; x64; rv:153.0) gecko/20100101 firefox/153.0'),
(34,1,'Miguel Ángel Sáinz Gasperín','2026-07-24 09:53:45','Inicio de sesión','1','127.0.0.1','50281','mozilla/5.0 (windows nt 10.0; win64; x64; rv:154.0) gecko/20100101 firefox/154.0'),
(35,1,'Miguel Ángel Sáinz Gasperín','2026-07-24 17:59:13','Inicio de sesión','1','127.0.0.1','51345','mozilla/5.0 (windows nt 10.0; win64; x64; rv:154.0) gecko/20100101 firefox/154.0'),
(36,1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:38:19','Descuento registrado: Adultos mayores','1','127.0.0.1','62280','mozilla/5.0 (windows nt 10.0; win64; x64; rv:154.0) gecko/20100101 firefox/154.0'),
(37,1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:40:08','Descuento registrado: Estudiantes','2','127.0.0.1','51572','mozilla/5.0 (windows nt 10.0; win64; x64; rv:154.0) gecko/20100101 firefox/154.0'),
(38,1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:40:23','Descuento modificado: Estudiantes universitarios','2','127.0.0.1','51579','mozilla/5.0 (windows nt 10.0; win64; x64; rv:154.0) gecko/20100101 firefox/154.0'),
(39,1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:41:38','Descuento registrado: Personal de la SSP','3','127.0.0.1','50886','mozilla/5.0 (windows nt 10.0; win64; x64; rv:154.0) gecko/20100101 firefox/154.0'),
(40,1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:43:16','Descuento eliminado: Estudiantes universitarios','2','127.0.0.1','65285','mozilla/5.0 (windows nt 10.0; win64; x64; rv:154.0) gecko/20100101 firefox/154.0'),
(41,1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:51:51','Estudio modificado: Biometría Hemática Completa','1','127.0.0.1','63127','mozilla/5.0 (windows nt 10.0; win64; x64; rv:154.0) gecko/20100101 firefox/154.0'),
(42,1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:52:52','Estudio registrado: Perfil Femenino','6','127.0.0.1','63144','mozilla/5.0 (windows nt 10.0; win64; x64; rv:154.0) gecko/20100101 firefox/154.0');

/*Table structure for table `cat_convenios` */

DROP TABLE IF EXISTS `cat_convenios`;

CREATE TABLE `cat_convenios` (
  `id_convenio` int unsigned NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nombre_comercial` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `rfc` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `persona_contacto` varchar(200) NOT NULL,
  `telefono_contacto` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `correo_contacto` varchar(100) DEFAULT NULL,
  `direccion` varchar(300) DEFAULT NULL,
  `lista_precio_id` int unsigned DEFAULT NULL,
  `tipo` enum('LABORATORIO','EMPRESA','DOCTOR') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password_plataforma` blob,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `user_cap` varchar(150) NOT NULL,
  `fecha_cap` datetime NOT NULL,
  PRIMARY KEY (`id_convenio`),
  UNIQUE KEY `uk_rfc` (`razon_social`),
  KEY `fk_empresa_lista` (`lista_precio_id`),
  CONSTRAINT `fk_empresa_lista` FOREIGN KEY (`lista_precio_id`) REFERENCES `cat_listas_precios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `cat_convenios` */

insert  into `cat_convenios`(`id_convenio`,`razon_social`,`nombre_comercial`,`rfc`,`persona_contacto`,`telefono_contacto`,`correo_contacto`,`direccion`,`lista_precio_id`,`tipo`,`password_plataforma`,`activo`,`user_cap`,`fecha_cap`) values 
(1,'Centro de Laboratorios San Juditas S.A de C.V','Laboratorio San Juditas','HSJKALALWIOAPS','QFB. Veronica López Chávez','2287167191','juditas@gmail.com','Xalapa, Centro',1,'LABORATORIO','w�������\"�+�@J',1,'Miguel Ángel Sáinz Gasperín','2026-06-30 13:44:26'),
(2,'Clínica Especializada en Salud Banderilla','Clínica Banderilla Estelar','CESHAJ8KAKK','Lic. Alberto Hernández','9128282819','correo_banderilla@gmail.com','Banderilla, Veracruz',1,'EMPRESA',NULL,1,'Miguel Ángel Sáinz Gasperín','2026-06-29 19:51:38'),
(5,'Clínica Especializada en Salud Perote','Clínica Perote Profesional','JHASJHASJHA','Lic. Valeria Flores','9128282819','correo_perote@gmail.com','Perote, Veracruz',1,'EMPRESA',NULL,1,'Miguel Ángel Sáinz Gasperín','2026-06-29 19:48:35'),
(6,'José Luis López Garrido','Dr. José Luis López Garrido','JJJJJJJJJJJ','Romina López Rodríguez','2288828292','joseluloga@hotmail.com','Xalapa, Veracruz México',1,'DOCTOR',NULL,1,'Miguel Ángel Sáinz Gasperín','2026-06-30 12:17:16'),
(7,'Centro Médico Perote S.A de C.V','Centro Médico Perote.','HAGSHGASHGA','Romulo Fernández','8128718278','','Perote Veracruz C.P 891819',2,'EMPRESA','\'���3ܨ�J��0',1,'Miguel Ángel Sáinz Gasperín','2026-07-17 10:50:47');

/*Table structure for table `cat_descuentos_generales` */

DROP TABLE IF EXISTS `cat_descuentos_generales`;

CREATE TABLE `cat_descuentos_generales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `concepto_desc` varchar(150) NOT NULL,
  `porcentaje_desc` int NOT NULL,
  `activo` tinyint NOT NULL DEFAULT '1',
  `user_cap` varchar(150) NOT NULL,
  `fecha_cap` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `cat_descuentos_generales` */

insert  into `cat_descuentos_generales`(`id`,`concepto_desc`,`porcentaje_desc`,`activo`,`user_cap`,`fecha_cap`) values 
(1,'Adultos mayores',20,1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:38:19'),
(2,'Estudiantes universitarios',11,0,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:40:23'),
(3,'Personal de la SSP',15,0,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:41:38');

/*Table structure for table `cat_estudios` */

DROP TABLE IF EXISTS `cat_estudios`;

CREATE TABLE `cat_estudios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `tipo` enum('ESTUDIO','PAQUETE') NOT NULL DEFAULT 'ESTUDIO',
  `precio_publico` decimal(10,2) NOT NULL DEFAULT '0.00',
  `costo` decimal(10,2) NOT NULL DEFAULT '0.00',
  `descripcion_estudio` varchar(250) DEFAULT NULL,
  `indicaciones_toma` varchar(400) NOT NULL,
  `aplica_desc` enum('NO','SI') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'NO',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `user_cap` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fecha_cap` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_estudios_tipo_activo` (`tipo`,`activo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `cat_estudios` */

insert  into `cat_estudios`(`id`,`nombre`,`tipo`,`precio_publico`,`costo`,`descripcion_estudio`,`indicaciones_toma`,`aplica_desc`,`activo`,`user_cap`,`fecha_cap`) values 
(1,'Biometría Hemática Completa','ESTUDIO',100.00,20.00,'Biome','Ayuno de 6 horas.','SI',1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:51:51'),
(2,'Glucosa, Colesterol y Triglicéridos','ESTUDIO',110.00,0.00,'Glucosa','Ayuno de 7 horas.','NO',1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:47:36'),
(3,'Examen General de Orina','ESTUDIO',200.00,0.00,'EGO','Ayuno de 8 horas.','NO',1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:47:37'),
(4,'Perfil de Lípidos.','PAQUETE',150.50,0.00,'Lipidos','Ayuno de 9 horas.','NO',1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:47:39'),
(5,'Perfíl Masculino','PAQUETE',500.00,250.00,'Perfil principalmente para hombres mayores de 40 años','Ayuno de 12 horas','NO',1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:47:40'),
(6,'Perfil Femenino','PAQUETE',500.00,400.00,'Incluye: Biometría hemática completa, Examen general de orina','Ayuno de 8 horas','NO',1,'Miguel Ángel Sáinz Gasperín','2026-07-24 18:52:51');

/*Table structure for table `cat_listas_precios` */

DROP TABLE IF EXISTS `cat_listas_precios`;

CREATE TABLE `cat_listas_precios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `es_defecto` tinyint(1) DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `user_cap` varchar(150) NOT NULL,
  `fecha_cap` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `cat_listas_precios` */

insert  into `cat_listas_precios`(`id`,`nombre`,`descripcion`,`es_defecto`,`activo`,`user_cap`,`fecha_cap`) values 
(1,'Precio empresas','Aplica para todas las empresas con convenios',0,1,'Miguel Ángel Sáinz Gasperín','2026-07-17 13:31:13'),
(2,'Precio maquila','Precio especial para los clientes con convenio.',0,1,'Miguel Ángel Sáinz Gasperín','2026-07-01 13:40:38');

/*Table structure for table `cat_pacientes` */

DROP TABLE IF EXISTS `cat_pacientes`;

CREATE TABLE `cat_pacientes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `apellido_paterno` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `apellido_materno` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo_biologico` enum('MASCULINO','FEMENINO') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `user_portal` varchar(50) NOT NULL,
  `password_portal` blob NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `user_cap` varchar(150) NOT NULL,
  `fecha_cap` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user` (`user_portal`),
  KEY `idx_paciente_busqueda` (`apellido_paterno`,`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `cat_pacientes` */

insert  into `cat_pacientes`(`id`,`nombre`,`apellido_paterno`,`apellido_materno`,`fecha_nacimiento`,`sexo_biologico`,`telefono`,`correo`,`user_portal`,`password_portal`,`activo`,`user_cap`,`fecha_cap`) values 
(1,'Romina','López','Rodríguez','1987-09-11','FEMENINO','2288596167','romina.loguez@gmail.com','rLopez14','#i���Si�G\Zl*e',1,'Miguel Ángel Sáinz Gasperín','2026-07-03 14:39:06'),
(2,'Miranda','Sáinz','López','2016-03-19','FEMENINO','28272828191819','miranda@gmail.com','mSáinz92','�3�Ԭ����� ',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 16:43:36'),
(3,'Concepción','Gasperín','Zanatta','1960-09-14','FEMENINO','2711234683','conchita@gmail.com','cGasperín14','R�@I��b�KƗ%��',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 16:44:18'),
(4,'Mariel','Rodríguez','Armenta','1960-05-01','FEMENINO','228919011910','mariel@gmail.com','mRodríguez32','A/���?)�R$�d=�',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 16:46:08'),
(5,'José Luis','López','Garrido','1940-09-10','MASCULINO','2238181271','joseluloga@hotmail.com','jLópez11','������ҟl��\'��',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 16:47:04'),
(6,'Miguel Ángel','Sáinz','Gasperín','1986-11-29','MASCULINO','2281232870','miguel.gasperin9@gmail.com','mSáinz10','�t\r_���iFL�f',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:25:07'),
(7,'Daniel','Martínez','Hernández','1987-02-18','MASCULINO','2878755955','daniel@gmail.com','dMartínez70','2Z����楹*W\r�4',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:26:42'),
(8,'José Manuel','Coria','Gasperín','1992-10-12','MASCULINO','8172871287','manuel@gmail.com','jCoria79','�\Z�T��������6/�',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:29:25'),
(9,'Jonathan','Sáinz','Gasperín','1989-05-10','MASCULINO','8718271872','jona@gmail.com','jSáinz74','j���Ο��B�\\�L�',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:30:40'),
(10,'Mónica','Gasperín','Zanatta','1984-08-27','FEMENINO','8712871287','moni@gmail.com','mGasperín11','6���j�Fk��Yq\"�',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:33:47'),
(11,'Gustavo','López','Rodríguez','1984-06-12','MASCULINO','9812981928','gus@gmail.com','gLópez88','1�[��e� �v,�Ua�',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:37:49'),
(12,'Benjamín','López','Rodríguez','1988-09-22','MASCULINO','9239829382','benji@gmail.com','bLópez92','в,�h\0�5��ƛ�',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:40:57'),
(13,'Eloisa','López','Fernández','1987-06-22','FEMENINO','8712871287','elo@gmail.com','eLópez86','��/���\n�\Zׂ��',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:48:00'),
(14,'Berenice','Gasperín','Díaz','1986-08-27','FEMENINO','8712817287','bere@gmail.com','bGasperín72','��3[B���Q���',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:48:56'),
(15,'Alejandra','Dawe','Ramírez','1986-10-30','FEMENINO','1827187218','dawe@gmail.com','aDawe22','!����B.5��B��',1,'Miguel Ángel Sáinz Gasperín','2026-07-16 18:51:56');

/*Table structure for table `cat_sucursales` */

DROP TABLE IF EXISTS `cat_sucursales`;

CREATE TABLE `cat_sucursales` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `user_cap` varchar(150) NOT NULL,
  `fecha_cap` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `cat_sucursales` */

insert  into `cat_sucursales`(`id`,`nombre`,`direccion`,`telefono`,`activo`,`user_cap`,`fecha_cap`) values 
(1,'Matriz','Xalapa, Enríquez','2288565987',1,'','2026-06-19 17:21:44'),
(2,'Ávila Camacho','Manuel Ávila Camacho No. 92','2288291989',1,'Miguel Ángel Sáinz Gasperín','2026-06-30 17:27:12');

/*Table structure for table `cat_usuarios` */

DROP TABLE IF EXISTS `cat_usuarios`;

CREATE TABLE `cat_usuarios` (
  `id_usuario` int unsigned NOT NULL AUTO_INCREMENT,
  `id_sucursal_fk` int unsigned NOT NULL,
  `nombre` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasenia` blob NOT NULL,
  `perfil` enum('ADMINISTRADOR','RECEPCION','QUIMICO','VALIDADOR','GERENTE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `user_cap` varchar(200) NOT NULL,
  `fecha_cap` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uk_usuario` (`usuario`),
  UNIQUE KEY `uk_correo` (`correo`),
  KEY `fk_usuario_sucursal` (`id_sucursal_fk`),
  CONSTRAINT `fk_usuario_sucursal` FOREIGN KEY (`id_sucursal_fk`) REFERENCES `cat_sucursales` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `cat_usuarios` */

insert  into `cat_usuarios`(`id_usuario`,`id_sucursal_fk`,`nombre`,`usuario`,`correo`,`contrasenia`,`perfil`,`activo`,`user_cap`,`fecha_cap`) values 
(1,1,'Miguel Ángel Sáinz Gasperín','miguel','migue.gasperin9@gmail.com','c\0�־�~��y\'���','ADMINISTRADOR',1,'','2026-06-19 17:23:25'),
(2,1,'Romina López Rodríguez','romi','romina.loguez@gmail.com','M`�ZtU��$�+	O�#','GERENTE',1,'Miguel Ángel Sáinz Gasperín','2026-06-30 16:25:28');

/*Table structure for table `lista_precio_estudios` */

DROP TABLE IF EXISTS `lista_precio_estudios`;

CREATE TABLE `lista_precio_estudios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_lista_precio_fk` int unsigned NOT NULL,
  `id_estudio_fk` int unsigned NOT NULL,
  `nombre_estudio` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `precio` decimal(10,2) NOT NULL DEFAULT '0.00',
  `user_cap` varchar(150) NOT NULL,
  `fecha_cap` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_lista_estudio` (`id_lista_precio_fk`,`id_estudio_fk`),
  KEY `fk_lpe_estudio` (`id_estudio_fk`),
  CONSTRAINT `fk_lpe_estudio` FOREIGN KEY (`id_estudio_fk`) REFERENCES `cat_estudios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lpe_lista` FOREIGN KEY (`id_lista_precio_fk`) REFERENCES `cat_listas_precios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `lista_precio_estudios` */

insert  into `lista_precio_estudios`(`id`,`id_lista_precio_fk`,`id_estudio_fk`,`nombre_estudio`,`precio`,`user_cap`,`fecha_cap`) values 
(3,2,1,'Biometría Hemática Completa',90.00,'Miguel Ángel Sáinz Gasperín','2026-07-01 19:03:47'),
(4,2,2,'Glucosa, Colesterol y Triglicéridos',99.00,'Miguel Ángel Sáinz Gasperín','2026-07-01 19:03:47'),
(5,2,3,'Examen General de Orina',180.00,'Miguel Ángel Sáinz Gasperín','2026-07-01 19:03:47');

/*Table structure for table `login_intentos` */

DROP TABLE IF EXISTS `login_intentos`;

CREATE TABLE `login_intentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `intentos` int DEFAULT '1',
  `ultimo_intento` datetime NOT NULL,
  `bloqueado_hasta` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ip` (`ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

/*Data for the table `login_intentos` */

/*Table structure for table `orden_detalles` */

DROP TABLE IF EXISTS `orden_detalles`;

CREATE TABLE `orden_detalles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `orden_id` int unsigned NOT NULL,
  `estudio_id` int unsigned NOT NULL,
  `nombre_estudio_historico` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `precio_aplicado` decimal(10,2) NOT NULL DEFAULT '0.00',
  `costo_aplicado` decimal(10,2) DEFAULT '0.00',
  `fecha_cap` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estatus_orden` enum('RECEPCION','LABORATORIO','LISTO','ENTREGADO') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'RECEPCION',
  PRIMARY KEY (`id`),
  KEY `fk_detalle_orden` (`orden_id`),
  KEY `fk_detalle_concepto` (`estudio_id`),
  CONSTRAINT `fk_detalle_concepto` FOREIGN KEY (`estudio_id`) REFERENCES `cat_estudios` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_detalle_orden` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_trabajo` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `orden_detalles` */

/*Table structure for table `orden_pagos` */

DROP TABLE IF EXISTS `orden_pagos`;

CREATE TABLE `orden_pagos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `orden_id` int unsigned NOT NULL,
  `sucursal_id` int unsigned NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` enum('EFECTIVO','TARJETA','TRANSFERENCIA','OTRO') NOT NULL DEFAULT 'EFECTIVO',
  `referencia_pago` varchar(100) DEFAULT NULL,
  `usuario_recibio_id` int unsigned NOT NULL,
  `fecha_pago` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pago_orden` (`orden_id`),
  KEY `fk_pago_sucursal` (`sucursal_id`),
  KEY `fk_pago_usuario` (`usuario_recibio_id`),
  CONSTRAINT `fk_pago_orden` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_trabajo` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pago_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `cat_sucursales` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_pago_usuario` FOREIGN KEY (`usuario_recibio_id`) REFERENCES `cat_usuarios` (`id_usuario`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `orden_pagos` */

/*Table structure for table `ordenes_trabajo` */

DROP TABLE IF EXISTS `ordenes_trabajo`;

CREATE TABLE `ordenes_trabajo` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `folio` varchar(20) NOT NULL,
  `sucursal_id` int unsigned NOT NULL,
  `paciente_id` int unsigned NOT NULL,
  `paciente_nombre_historico` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `paciente_edad_registro` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `paciente_sexo_historico` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `convenio_id` int unsigned DEFAULT NULL,
  `tipo_convenio_historico` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `convenio_nombre_historico` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'PARTICULAR',
  `lista_precio_id` int unsigned NOT NULL,
  `lista_precio_nombre_historico` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `descuento` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_neto` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_abonado` decimal(10,2) NOT NULL DEFAULT '0.00',
  `saldo_deudor` decimal(10,2) NOT NULL DEFAULT '0.00',
  `estatus_pago` enum('PENDIENTE','PARCIAL','PAGADO','CREDITO_EMPRESA') NOT NULL DEFAULT 'PENDIENTE',
  `archivo_pdf_path` varchar(255) DEFAULT NULL,
  `estatus` enum('RECEPCION','LABORATORIO','LISTO','ENTREGADO') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'RECEPCION',
  `fecha_subida_pdf` datetime DEFAULT NULL,
  `user_subida_pdf` varchar(150) DEFAULT NULL,
  `user_cap` varchar(150) NOT NULL,
  `fecha_cap` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `folio` (`folio`),
  KEY `idx_ordenes_sucursal_estatus` (`sucursal_id`,`estatus`),
  KEY `fk_orden_sucursal` (`sucursal_id`),
  KEY `fk_orden_paciente` (`paciente_id`),
  KEY `fk_orden_lista` (`lista_precio_id`),
  KEY `idx_ordenes_fecha` (`fecha_cap`),
  KEY `fk_orden_usuario_crea` (`user_cap`),
  KEY `fk_orden_cliente` (`convenio_id`),
  CONSTRAINT `fk_orden_lista` FOREIGN KEY (`lista_precio_id`) REFERENCES `cat_listas_precios` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_orden_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `cat_pacientes` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_orden_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `cat_sucursales` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `ordenes_trabajo` */

/* Trigger structure for table `orden_pagos` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `tg_actualizar_saldos_insert` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `tg_actualizar_saldos_insert` AFTER INSERT ON `orden_pagos` FOR EACH ROW BEGIN
    -- 1. Actualizamos los acumulados en la orden de trabajo correspondiente
    UPDATE `ordenes_trabajo`
    SET 
        `total_abonado` = `total_abonado` + NEW.`monto`,
        `saldo_deudor`  = `total_neto` - (`total_abonado`),
        -- Cambiamos el estatus de pago de forma dinámica
        `estatus_pago`  = CASE 
            WHEN (`total_neto` - `total_abonado`) <= 0 THEN 'PAGADO'
            WHEN `total_abonado` > 0 AND (`total_neto` - `total_abonado`) > 0 THEN 'PARCIAL'
            ELSE 'PENDIENTE'
        END
    WHERE `id` = NEW.`orden_id`;
END */$$


DELIMITER ;

/* Trigger structure for table `orden_pagos` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `tg_actualizar_saldos_delete` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `tg_actualizar_saldos_delete` AFTER DELETE ON `orden_pagos` FOR EACH ROW BEGIN
    -- Recalculamos restando el impacto del abono eliminado
    UPDATE `ordenes_trabajo`
    SET 
        `total_abonado` = `total_abonado` - OLD.`monto`,
        `saldo_deudor`  = `total_neto` - (`total_abonado`),
        `estatus_pago`  = CASE 
            WHEN `total_abonado` <= 0 THEN 'PENDIENTE'
            WHEN (`total_neto` - `total_abonado`) <= 0 THEN 'PAGADO'
            ELSE 'PARCIAL'
        END
    WHERE `id` = OLD.`orden_id`;
END */$$


DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
