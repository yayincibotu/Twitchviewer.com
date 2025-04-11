const { db } = require('./server/db');
const { users } = require('./shared/schema');
const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');
const { eq } = require('drizzle-orm');

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64));
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  console.log('Creating admin user...');
  
  // Admin kullanıcı bilgileri
  const username = 'exenica';
  const email = 'admin@twitchviewer.com';
  const password = '19891990Can';
  
  try {
    // Mevcut kullanıcıyı kontrol et
    const existingUser = await db.select().from(users).where(eq(users.username, username));
    
    if (existingUser.length > 0) {
      console.log('Admin user already exists.');
      process.exit(0);
    }
    
    // Şifreyi hashle
    const hashedPassword = await hashPassword(password);
    
    // Yeni admin kullanıcı oluştur
    const [user] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      emailVerified: true,
      role: 'admin'
    }).returning();
    
    console.log('Admin user created successfully:', {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Veritabanı bağlantısını kapat
    process.exit(0);
  }
}

createAdminUser();