const signup = async (req, res) => {
  const { name, email, password, role, location } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await createUser({
    name,
    email,
    password: hashedPassword,
    role,
    location: role === "owner" ? location : null 
  });

  res.status(201).json({ message: "User registered", userId });
};
