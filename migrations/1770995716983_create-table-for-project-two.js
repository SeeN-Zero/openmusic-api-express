export const up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        username: {
            type: 'TEXT',
            notNull: true,
        },
        password: {
            type: 'TEXT',
            notNull: true,
        },
        fullname: {
            type: 'TEXT',
            notNull: true,
        },
    });
    pgm.addConstraint('users', 'users_username_unique', {
        unique: ['username'],
    });

    pgm.createTable('authentications', {
        token: {
            type: 'TEXT',
            primaryKey: true,
        },
    });

    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
    });

    pgm.createTable('collaborations', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'playlists',
            onDelete: 'CASCADE',
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
    });
    pgm.addConstraint('collaborations', 'collaborations_playlist_id_user_id_unique', {
        unique: ['playlist_id', 'user_id'],
    });

    pgm.createTable('playlist_songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'playlists',
            onDelete: 'CASCADE',
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'songs',
            onDelete: 'CASCADE',
        },
    });
    pgm.addConstraint('playlist_songs', 'playlist_songs_playlist_id_song_id_unique', {
        unique: ['playlist_id', 'song_id'],
    });

    pgm.createTable('playlist_song_activities', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'playlists',
            onDelete: 'CASCADE',
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'songs',
            onDelete: 'CASCADE',
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        action: {
            type: 'TEXT',
            notNull: true,
        },
        time: {
            type: 'TIMESTAMP',
            notNull: true,
        },
    });
};

export const down = (pgm) => {
    pgm.dropTable('playlist_song_activities');
    pgm.dropTable('playlist_songs');
    pgm.dropTable('collaborations');
    pgm.dropTable('playlists');
    pgm.dropTable('authentications');
    pgm.dropTable('users');
};
