-- create function statement
create function count_row()
	returns int
	language plpgsql
	as
$$
	declare
		data_count integer;
	begin
		select count(1)
		into data_count
		from todos;
		
		return data_count;
	end;
	
$$;