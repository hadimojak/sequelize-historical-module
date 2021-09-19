SELECT id,
    firstName,
    lastName,
    createdAt,
    updatedAt,
    deletedAt
FROM userhistories
where id = 1
order by hid desc
limit 1;
delete FROM users
where id = 1
UPDATE users
SET deletedAt = null
WHERE id = 1;

delimiter #
CREATE TRIGGER update_cus AFTER
UPDATE ON users FOR EACH ROW
 BEGIN
insert into userhistories (user_id, firstName, lastName, opration, ip)
values (
        old.id,
        old.firstName,
        old.lastName,
        CASE WHEN new.deletedAt IS NOT NULL THEN 'delete' ELSE 'update' END,
        new.ip
    );
end#
delimiter ;