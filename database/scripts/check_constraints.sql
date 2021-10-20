ALTER TABLE
    'catbox'.'room_state'
ADD
    CONSTRAINT CHECK (
        (
            is_active IS NOT NULL
            AND is_active = room_id
            AND is_deleted IS NULL
        )
        OR (
            is_deleted IS NOT NULL
            AND is_deleted = room_id
            AND is_active IS NULL
        )
    );