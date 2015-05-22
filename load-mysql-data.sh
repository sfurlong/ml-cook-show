/usr/local/mysql/bin/mysql -e "use test; \
--	delete from employee; \
	insert into employee (firstname, lastname, id, addr1, city, state, zipcode, lastMod) \
		values ( 'dave', 'grant', 1, '100 julie road', 'sanatoga', 'pa', '19464', '2015-02-24T09:01:02' ); \
	insert into employee (firstname, lastname, id, addr1, city, state, zipcode, lastMod) \
		values ( 'fred', 'flintstone', 2, '100 bedrock road', 'bedrock', 'no', '00000', '2014-12-24T11:01:02');"

/usr/local/mysql/bin/mysql -e "use test; \
--	delete from member; \
	insert into member (firstname, lastname, id, addr1, city, state, zipcode, lastMod) values \
		( 'Jane', 'Lynch', 'GEXMLOLWF5JJXOGA', '100 hollywood blvd', 'hollywood', 'ca', '90027', '2015-02-24T09:01:02' ), \
		( 'Tom', 'Hanks', 'RECBEP3Z8ERDMK4C', '100 bedrock road', 'orlando', 'fl', '32805', '2014-12-24T11:01:02'), \
		( 'Harrison', 'Ford', 'T2VOPPXBL1NZTLBD', '44 mountain drive', 'jackson hole', 'wy', '83001', '2015-01-04T11:01:02'), \
		( 'Ashley', 'Judd', 'P1XSQWCLB4FWL/ZT', '3400 magnolia circle', 'lexington', 'ky', '40508', '2014-02-04T11:01:02'), \
		( 'Morgan', 'Freeman', 'EWXKH5NRG38VISST', '1234 cowb0y lane', 'dallas', 'tx', '75206', '2012-02-04T11:01:02'), \
		( 'Matt', 'Damon', 'TXJKP+DBZ7CFXRZB', '99 houston drive', 'boston', 'ma', '02134', '2013-08-22T11:01:02'), \
		( 'John', 'Cusack', 'AGWQKY0SSVDDXBT2', '890 michigan ave', 'detroit', 'mi', '48204', '2011-04-03T11:01:02'), \
		( 'Idris', 'Elba', 'UOIYUJUUVU+NY8NO', '45 7th st', 'new york city', 'ny', '10019', '2015-02-21T11:01:02'), \
		( 'Bob', 'Barker', 'SWVQ+SNGIXTLYO4N', '9880 beverly hills drive', 'beverly hills', 'ca', '90210', '2014-05-01T11:01:02');"

/usr/local/mysql/bin/mysql -e "use test; \
--	delete from geonamesPostcode;
	LOAD DATA INFILE '/vagrant/data/geonames/postcode-US.txt'
	into table geonamesPostcode
		(countryCode, postalCode, placeName, adminName1, adminCode1, adminName2, adminCode2, adminName3, adminCode3,
		latitude, longitude, accuracy);"
