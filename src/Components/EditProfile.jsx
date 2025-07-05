import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Stack,
  Paper,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

// const API_URL = "http://localhost:8000/v1/api/user";
const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/user";

const ProfileEdit = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      setProfilePicFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (profilePicFile) formData.append("profilepic", profilePicFile);
    formData.append("fullname", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    try {
      const res = await fetch(`${API_URL}/update-account`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      console.log(data)
      alert("Profile updated successfully!");
      // Optionally redirect or update user state here
    } catch (err) {
      alert(err.message || "Error updating profile");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" mb={3}>
          Edit Profile
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2} alignItems="center">
            {/* Profile Image Upload */}
            <label htmlFor="upload-photo">
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-photo"
                type="file"
                onChange={handleImageChange}
              />
              <Avatar
                src={profilePic || ""}
                sx={{
                  width: 90,
                  height: 90,
                  cursor: "pointer",
                  bgcolor: "#1976d2",
                }}
              >
                {!profilePic && <PhotoCamera />}
              </Avatar>
            </label>

            {/* Full Name */}
            <TextField
              label="Full Name"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Email */}
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Phone Number */}
            <TextField
              label="Phone Number"
              type="tel"
              fullWidth
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* Address */}
            <TextField
              label="Address"
              multiline
              rows={3}
              fullWidth
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 1, py: 1 }}
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileEdit;
