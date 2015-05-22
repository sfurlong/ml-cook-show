/usr/local/mysql/bin/mysql -e "use test; \
--	drop index geonames_post_code_postal_code on geonamesPostcode;
--	drop table geonamesPostcode;

	create table if not exists employee( \
		firstName CHAR(30) CHARACTER SET utf8 COLLATE utf8_bin, \
		lastName CHAR(30) CHARACTER SET utf8 COLLATE utf8_bin, \
		id INT, \
		addr1 CHAR(30) CHARACTER SET utf8 COLLATE utf8_bin, \
		city CHAR(30) CHARACTER SET utf8 COLLATE utf8_bin, \
		state CHAR(2) CHARACTER SET utf8 COLLATE utf8_bin, \
		zipcode CHAR(11) CHARACTER SET utf8 COLLATE utf8_bin, \
		lastMod TIMESTAMP
	); \
	create table if not exists member( \
		firstName CHAR(30) CHARACTER SET utf8 COLLATE utf8_bin, \
		lastName CHAR(30) CHARACTER SET utf8 COLLATE utf8_bin, \
		id CHAR(30) CHARACTER SET utf8 COLLATE utf8_bin, \
		addr1 CHAR(30) CHARACTER SET utf8 COLLATE utf8_bin, \
		city CHAR(30) CHARACTER SET utf8 COLLATE utf8_bin, \
		state CHAR(2) CHARACTER SET utf8 COLLATE utf8_bin, \
		zipcode CHAR(11) CHARACTER SET utf8 COLLATE utf8_bin, \
		lastMod TIMESTAMP
	); \
	create table if not exists geonamesPostcode ( \
		countryCode CHAR(2), \
		postalCode CHAR(20) CHARACTER SET utf8 COLLATE utf8_bin, \
		placeName CHAR(180) CHARACTER SET utf8 COLLATE utf8_bin, \
		adminName1 CHAR(100) CHARACTER SET utf8 COLLATE utf8_bin, \
		adminCode1 CHAR(20) CHARACTER SET utf8 COLLATE utf8_bin, \
		adminName2 CHAR(100) CHARACTER SET utf8 COLLATE utf8_bin, \
		adminCode2 CHAR(20) CHARACTER SET utf8 COLLATE utf8_bin, \
		adminName3 CHAR(100) CHARACTER SET utf8 COLLATE utf8_bin, \
		adminCode3 CHAR(20) CHARACTER SET utf8 COLLATE utf8_bin, \
		latitude decimal(10,7), \
		longitude decimal(10,7), \
		accuracy INT
	);
	create table if not exists employer( \
		id INT, \
		name CHAR(50) CHARACTER SET utf8 COLLATE utf8_bin \
	);
	create index geonames_post_code_postal_code on geonamesPostcode (postalCode);"
