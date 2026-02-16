export const up = (pgm) => {
    pgm.createTable('user_album_likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'albums',
            onDelete: 'CASCADE',
        },
    });

    pgm.addConstraint('user_album_likes', 'user_album_likes_user_id_album_id_unique', {
        unique: ['user_id', 'album_id'],
    });
};

export const down = (pgm) => {
    pgm.dropTable('user_album_likes');
};
