USE itp40;

CREATE TABLE `itp40lavinput` (
  `codice_param` int(11) NOT NULL,
  `progressivo_param` int(11) NOT NULL,
  `valore_param` varchar(45) NOT NULL,
  `t_stamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`codice_param`,`progressivo_param`),
  KEY `codice_parametro_idx` (`codice_param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `itp40lavorazioni` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_macchina` int(11) DEFAULT NULL,
  `cod_cartellino` varchar(30) DEFAULT NULL,
  `codice_articolo` varchar(30) DEFAULT NULL,
  `n_pelli` int(11) DEFAULT NULL,
  `peso_pelli` decimal(7,3) DEFAULT NULL,
  `cod_ricetta` varchar(20) DEFAULT NULL,
  `nome_ricetta` varchar(45) DEFAULT NULL,
  `stato` int(11) DEFAULT NULL,
  `data_inizio` datetime DEFAULT NULL,
  `data_fine` datetime DEFAULT NULL,
  `data_inserimento` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ID_MACCHINA_idx` (`id_macchina`),
  CONSTRAINT `ID_MACCHINA` FOREIGN KEY (`id_macchina`) REFERENCES `itp40macchine` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `itp40lavoutput` (
  `codice_param` int(11) NOT NULL,
  `progressivo_param` int(11) NOT NULL,
  `valore_param` varchar(45) DEFAULT NULL,
  `t_stamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`codice_param`,`progressivo_param`),
  KEY `codice_idx` (`codice_param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `itp40macchine` (
  `id` int(11) NOT NULL,
  `tipo` int(11) DEFAULT NULL,
  `siglia` varchar(15) DEFAULT NULL,
  `nome` varchar(45) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tipo_idx` (`tipo`),
  CONSTRAINT `tipo` FOREIGN KEY (`tipo`) REFERENCES `itp40tipomacchine` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `itp40parametri` (
  `codice` int(11) NOT NULL,
  `descrizione` varchar(45) DEFAULT NULL,
  `unita_misura` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`codice`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `itp40tipomacchine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;