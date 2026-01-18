export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('albums', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'INTEGER',
            notNull: true,
        },
    });

    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'INTEGER',
            notNull: true,
        },
        performer: {
            type: 'TEXT',
            notNull: true,
        },
        genre: {
            type: 'TEXT',
            notNull: true,
        },
        duration: {
            type: 'INTEGER',
            notNull: false,
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: false,
            references: 'albums',
            onDelete: 'CASCADE',
        },
    });
};

export const down = (pgm) => {
    pgm.dropTable({schema: 'openmusic_schema', name: 'songs'});
    pgm.dropTable({schema: 'openmusic_schema', name: 'albums'});
};
