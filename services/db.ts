import mongoose from 'mongoose';

export const startDB = () => {
	const { DB_URL } = process.env;
	if (!DB_URL) {
		throw new Error('DB_URL env variable missing');
	}

	mongoose.connect(DB_URL);
	const db = mongoose.connection;
	db.on('error', (error) => console.error(error));
	db.once('open', () => console.log('Connected to mongo database'));
};

export const closeDB = async () => {
	await mongoose.connection.close();
};
