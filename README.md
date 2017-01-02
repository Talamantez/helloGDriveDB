# helloGDriveDB

# db details
location:
https://docs.google.com/spreadsheets/d/1xxErYmB9fks1mEMMSGleig1h37QVaigusKDhw11y_CA/edit#gid=0

sharing link:
https://docs.google.com/spreadsheets/d/1xxErYmB9fks1mEMMSGleig1h37QVaigusKDhw11y_CA/edit?usp=sharing

fields:
Column A: user_id (Int)
Column B: first_name (String)
Column C: last_name (String)

technical source docs:
https://www.blockspring.com/blog/google-spreadsheet-as-database
https://open.blockspring.com/donpinkus/query-public-google-spreadsheet



# json output form

```senators{
	0(sen_id):{
		sen_state: 'AK',
		name_last: 'Murkowski',
		offices_address:{
			0(office_num): '709 Hart Senate Office Building, Washington, DC 20510',
			1(office_num): '510 L Street, Suite 550, Anchorage, AK 99501'
		}
	}
}```

# test json output form
```senatorsByLastName{
	0: 'Murkowski',
	1: 'Sullivan',
	2: 'Shelby'
}```