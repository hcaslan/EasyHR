import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {Button, Container, Typography, Box, CircularProgress, IconButton, TextField} from "@mui/material";
import { fetchUploadFile } from "../../../store/feature/slideSlice";
import { HumanResources, useAppSelector } from "../../../store";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {Cloud, CloudUpload} from "@mui/icons-material";

const FileUpload: React.FC = () => {
  const [fileMobile, setFileMobile] = useState<File | null>(null);
  const [fileDesktop, setFileDesktop] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useDispatch<HumanResources>();
  const [loading, setLoading] = useState(false);

  const[city, setCity] = useState('');
  const[district, setDistrict] = useState('');
  const[neighborhood, setNeighborhood] = useState('');
  const[projection, setProjection] = useState('');
  const[concept, setConcept] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!fileMobile || !fileDesktop) {
      setMessage("Please select both files to upload.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fileMobile", fileMobile);
      formData.append("fileDesktop", fileDesktop);

      const result = await dispatch(fetchUploadFile({ token, formData })).unwrap();
      setMessage("Upload successful! " + (result.message || "Slides created."));
    } catch (error) {
      setMessage("Failed to upload files. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChangeMobile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileMobile(event.target.files[0]);
    }
  };

  const handleFileChangeDesktop = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileDesktop(event.target.files[0]);
    }
  };

  return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography sx={{ textAlign: 'center' ,fontWeight: 'bold'}} variant="h4" component="h2" gutterBottom>
          Upload .zip Files
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" gutterBottom>
              Mobile File:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, border: '3px dashed grey', p: 2, borderRadius: 1 }}>
              <IconButton color="primary" component="label">
                <CloudUpload />
                <input
                    type="file"
                    onChange={handleFileChangeMobile}
                    accept=".zip"
                    hidden
                />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {fileMobile ? fileMobile.name : "No file selected"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" gutterBottom>
              Desktop File:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, border: '3px dashed grey', p: 2, borderRadius: 1 }}>
              <IconButton color="primary" component="label">
                <CloudUpload />
                <input
                    type="file"
                    onChange={handleFileChangeDesktop}
                    accept=".zip"
                    hidden
                />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {fileDesktop ? fileDesktop.name : "No file selected"}
              </Typography>
            </Box>
          </Box>
          <TextField

              label="City"
              variant="outlined"
              onChange={(event) => setCity(event.target.value)}
              value={city}
              sx={{ marginTop: 3 }}
              fullWidth
              inputProps={{ maxLength: 50 }}
          />
          <TextField

              label="District"
              variant="outlined"
              onChange={(event) => setDistrict(event.target.value)}
              value={district}
              sx={{ marginTop: 3 }}
              fullWidth
              inputProps={{ maxLength: 50 }}
          />
          <TextField

              label="Neighborhood"
              variant="outlined"
              onChange={(event) => setNeighborhood(event.target.value)}
              value={neighborhood}
              sx={{ marginTop: 3 }}
              fullWidth
              inputProps={{ maxLength: 50 }}
          />
          <TextField

              label="Projection"
              variant="outlined"
              onChange={(event) => setProjection(event.target.value)}
              value={projection}
              sx={{ marginTop: 3 }}
              fullWidth
              inputProps={{ maxLength: 50 }}
          />
          <TextField

              label="Concept"
              variant="outlined"
              onChange={(event) => setConcept(event.target.value)}
              value={concept}
              sx={{ marginTop: 3 }}
              fullWidth
              inputProps={{ maxLength: 50 }}
          />
          <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !fileMobile || !fileDesktop}
              sx={{ mt: 3 }}
              fullWidth
          >
            Upload
          </Button>
        </Box>
        {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
              <CircularProgress />
            </Box>
        )}
        {message && (
            <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
              {message}
            </Typography>
        )}
      </Container>
  );
};

export default FileUpload;