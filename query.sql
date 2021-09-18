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