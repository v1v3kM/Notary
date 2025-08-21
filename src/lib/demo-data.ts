// Demo user data for testing the application
export const demoUsers = {
  client: {
    id: "demo-client-123",
    email: "democlient@example.com",
    password: "demo123",
    name: "Demo Client",
    phone: "+91 9876543210",
    role: "client" as const,
    aadhaar_number: "1234 5678 9012",
    pan_number: "ABCDE1234F",
    address: "123 Demo Street, Mumbai, Maharashtra 400001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  lawyer: {
    id: "demo-lawyer-456",
    email: "demolawyer@example.com", 
    password: "demo123",
    name: "Demo Lawyer",
    phone: "+91 9876543211",
    role: "lawyer" as const,
    aadhaar_number: "9876 5432 1098",
    pan_number: "FGHIJ5678K",
    address: "456 Legal Avenue, Delhi, NCR 110001",
    specialization: "Contract Law, Property Law, Corporate Law",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
};

export const getDemoCredentials = (role: 'client' | 'lawyer') => {
  return {
    email: demoUsers[role].email,
    password: demoUsers[role].password
  };
};

export const isDemoUser = (email: string) => {
  return email === demoUsers.client.email || email === demoUsers.lawyer.email;
};

export const getDemoUser = (email: string) => {
  if (email === demoUsers.client.email) return demoUsers.client;
  if (email === demoUsers.lawyer.email) return demoUsers.lawyer;
  return null;
};
