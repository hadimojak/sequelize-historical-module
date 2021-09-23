
-- triger for users table
delimiter #
CREATE TRIGGER update_user AFTER
UPDATE ON users FOR EACH ROW
 BEGIN
insert into userhistories (user_id, firstName, lastName, opration, ip,platform)
values (
        old.id,
        old.firstName,
        old.lastName,
        CASE WHEN new.deletedAt IS NOT NULL THEN 'delete' ELSE 'update' END,
        new.ip
    );
end#
delimiter ;

-- trigger for products table
delimiter #
CREATE TRIGGER update_product AFTER
UPDATE ON products FOR EACH ROW
 BEGIN
insert into producthistories (product_id, title, price, opration, ip)
values (
        old.id,
        old.firstName,
        old.lastName,
        CASE WHEN new.deletedAt IS NOT NULL THEN 'delete' ELSE 'update' END,
        new.ip
    );
end#
delimiter ;