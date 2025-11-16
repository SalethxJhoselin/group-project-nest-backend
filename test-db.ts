import { Client } from 'pg';

const client = new Client({
  host: 'aws-0-us-west-2.pooler.supabase.com',
  port: 5432,
  user: 'postgres.emrgxiakdumwnqnsnyfw',
  password: 'IpsYQTarXahBhB6o',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

client.connect()
  .then(() => console.log('✅ Conexión exitosa'))
  .catch(err => console.error('❌ Error de conexión:', err));