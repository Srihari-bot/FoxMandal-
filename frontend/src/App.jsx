import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Button,
  LinearProgress,
  TextField,
  Grid,
  AppBar,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Card,
  CardContent,
  Link,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Rating,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Spellcheck as SpellcheckIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  NavigateNext as NavigateNextIcon,
  Report as ReportIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  PanTool as PanToolIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import './App.css';

// Step labels
const steps = ['Upload Document', 'Quality Check', 'Document Analysis', 'Generate Report', 'Edit & Download'];

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#23272F', // dark gray
      light: '#3A3F4B',
      dark: '#181A20',
      contrastText: '#fff',
    },
    secondary: {
      main: '#C9A14A', // gold
      light: '#E6C97A',
      dark: '#A4842E',
      contrastText: '#23272F',
    },
    background: {
      default: '#F4F4F7',
      paper: '#fff',
    },
    text: {
      primary: '#23272F',
      secondary: '#6B6F76',
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 28px',
          fontWeight: 600,
          fontSize: '1.05rem',
          boxShadow: 'none',
          letterSpacing: '0.5px',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(201,161,74,0.10)',
            backgroundColor: '#C9A14A',
            color: '#23272F',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #23272F 60%, #3A3F4B 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(90deg, #C9A14A 60%, #E6C97A 100%)',
          color: '#23272F',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 24px rgba(35,39,47,0.07)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(35,39,47,0.07)',
          background: '#fff',
          color: '#23272F',
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '24px 0',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontWeight: 600,
        },
        iconContainer: {
          color: '#C9A14A',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#C9A14A',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#C9A14A',
          },
        },
      },
    },
  },
});

// API base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Empty string for production since we'll use relative paths when deployed together
  : 'http://localhost:8000';

// Add form types constant before the App component
const AVAILABLE_FORMS = [
  {
    id: 'form15',
    name: 'Form 15 - Certificate Application',
    description: 'Certificate application for issue and registration of immovable asset',
    icon: '🏛️'
  },
  {
    id: 'rtc',
    name: 'RTC - Village Account Form No. 2',
    description: 'Record of Rights, Tenancy and Crops (RTC) form',
    icon: '📄'
  },
  // Add more forms here as needed
  // {
  //   id: 'form16',
  //   name: 'Form 16 - Another Form',
  //   description: 'Description of another form',
  //   icon: '📄'
  // }
];

// Add form options constants
const soilTypes = [
  'Sand',
  'Clay',
  'Loam',
  'Silt',
  'Red Soil',
  'Black Soil',
  'Alluvial Soil',
  'Laterite Soil'
];

const irrigationSources = [
  'Borewell',
  'Canal',
  'Well',
  'Tank',
  'Rainfed',
  'Other'
];

const cultivationSystems = [
  '1',
  '2',
  '3',
  '4',
  '5'
];

const landUseTypes = [
  'Kaulki',
  'Tari',
  'Bagayatu',
  'Mixed'
];

const cropTypes = [
  'Paddy',
  'Ragi',
  'Jowar',
  'Maize',
  'Cotton',
  'Sugarcane',
  'Vegetables',
  'Fruits',
  'Other'
];

// Add this CSS constant after the imports
const markdownStyles = `
  .markdown-container {
    padding: 20px;
    line-height: 1.6;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .markdown-container h1 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .markdown-container h2 {
    color: #34495e;
    margin-top: 30px;
    margin-bottom: 15px;
  }
  
  .markdown-container h3 {
    color: #2c3e50;
    margin-top: 25px;
    margin-bottom: 10px;
  }
  
  .markdown-container p {
    margin-bottom: 15px;
    text-align: justify;
  }
  
  .markdown-container ul, .markdown-container ol {
    margin-bottom: 15px;
    padding-left: 20px;
  }
  
  .markdown-container li {
    margin-bottom: 5px;
  }
  
  .markdown-container table {
    border-collapse: collapse;
    width: 100%;
    margin: 20px 0;
    border: 1px solid #ddd;
  }
  
  .markdown-container th, .markdown-container td {
    border: 1px solid #ddd;
    padding: 10px 12px;
    text-align: left;
    vertical-align: top;
  }
  
  .markdown-container th {
    background-color: #D9E2F3;
    font-weight: 700;
    color: #000;
    border-bottom: 2px solid #888;
  }
  
  .markdown-container tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  .markdown-container tr:hover {
    background-color: #f0f8ff;
  }
  
  .markdown-container img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 10px 0;
  }
  
  .markdown-container .logo-header {
    text-align: left;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
  }
  
  .markdown-container .logo-header img {
    height: 60px;
    max-width: 200px;
    margin: 0;
  }
  
  .markdown-container blockquote {
    border-left: 4px solid #3498db;
    margin: 20px 0;
    padding: 10px 20px;
    background-color: #f8f9fa;
    font-style: italic;
  }
  
  .markdown-container code {
    background-color: #f1f2f6;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
  }
  
  .markdown-container pre {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    border: 1px solid #e9ecef;
  }
`;

// Add Form15Application component before the App component
const Form15Application = ({ data, onChange, onSave }) => {
  const [formData, setFormData] = useState(data || {
    applicationId: '',
    certificateNumber: '',
    applicationDate: '',
    villageName: '',
    hohl: '',
    surveyNumbers: '',
    boundaries: {
      north: '',
      east: '',
      west: '',
      south: '',
      northSouthLength: '',
      eastWestLength: '',
    },
    area: {
      acres: '',
      guntas: '',
      cents: '',
      hectares: '',
    },
    documentDetails: {
      bookVolume: 'Book 1',
      searchFromDate: '',
      searchToDate: '',
      ordinance: '',
    },
    ownerDetails: {
      name: '',
      fatherName: '',
      bankReference: '',
    },
    landDetails: {
      type: '',
      surveyReference: '',
      areaAcres: '',
      areaGuntas: '',
      possessionType: '',
      hasEncumbrance: '',
      encumbranceDetails: '',
    },
    referenceNumbers: {
      villageCode: '',
      formReference: '',
      documentId: '',
    },
  });

  // Ensure all nested objects are initialized when data changes
  useEffect(() => {
    if (data) {
      setFormData(prevData => ({
        ...prevData,
        ...data,
        boundaries: {
          ...prevData.boundaries,
          ...(data.boundaries || {})
        },
        area: {
          ...prevData.area,
          ...(data.area || {})
        },
        documentDetails: {
          ...prevData.documentDetails,
          ...(data.documentDetails || {})
        },
        ownerDetails: {
          ...prevData.ownerDetails,
          ...(data.ownerDetails || {})
        },
        landDetails: {
          ...prevData.landDetails,
          ...(data.landDetails || {})
        },
        referenceNumbers: {
          ...prevData.referenceNumbers,
          ...(data.referenceNumbers || {})
        }
      }));
    }
  }, [data]);

  const handleChange = (section, field, value) => {
    setFormData(prev => {
      const newData = section.includes('.') 
        ? {
            ...prev,
            [section.split('.')[0]]: {
              ...prev[section.split('.')[0]],
              [section.split('.')[1]]: value
            }
          }
        : {
            ...prev,
            [section]: value
          };
      
      // Generate formatted text from form data
      const formattedText = formatFormDataToText(newData);
      
      // Call onChange with both form data and formatted text
      onChange(newData, formattedText);
      
      return newData;
    });
  };

  const formatFormDataToText = (data) => {
    return `Form 15 - Certificate Application

Application Details:
Application ID: ${data.applicationId}
Certificate Number: ${data.certificateNumber}
Application Date: ${data.applicationDate}

Location Details:
Village Name: ${data.villageName}
Hohl: ${data.hohl}
Survey Numbers: ${data.surveyNumbers}

Boundaries:
North: ${data.boundaries.north}
East: ${data.boundaries.east}
West: ${data.boundaries.west}
South: ${data.boundaries.south}
North-South Length: ${data.boundaries.northSouthLength}
East-West Length: ${data.boundaries.eastWestLength}

Area:
Acres: ${data.area.acres}
Guntas: ${data.area.guntas}
Cents: ${data.area.cents}
Hectares: ${data.area.hectares}

Document Details:
Book Volume: ${data.documentDetails.bookVolume}
Search From Date: ${data.documentDetails.searchFromDate}
Search To Date: ${data.documentDetails.searchToDate}
Ordinance: ${data.documentDetails.ordinance}

Owner Details:
Name: ${data.ownerDetails.name}
Father's Name: ${data.ownerDetails.fatherName}
Bank Reference: ${data.ownerDetails.bankReference}

Land Details:
Type: ${data.landDetails.type}
Survey Reference: ${data.landDetails.surveyReference}
Area (Acres): ${data.landDetails.areaAcres}
Area (Guntas): ${data.landDetails.areaGuntas}
Possession Type: ${data.landDetails.possessionType}
Has Encumbrance: ${data.landDetails.hasEncumbrance}
Encumbrance Details: ${data.landDetails.encumbranceDetails}

Reference Numbers:
Village Code: ${data.referenceNumbers.villageCode}
Form Reference: ${data.referenceNumbers.formReference}
Document ID: ${data.referenceNumbers.documentId}`;
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        🏛️ Government of Karnataka – Form 15 Application Form
      </Typography>
      <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mb: 3 }}>
        (As per Rule 148) - Certificate application for issue and registration of immovable asset
      </Typography>

      <Grid container spacing={3}>
        {/* Application Details Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              📄 Application Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Application ID / RG CONSIFY Code"
                  value={formData.applicationId}
                  onChange={(e) => handleChange('applicationId', '', e.target.value)}
                  placeholder="FCC-__________"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Certificate Number"
                  value={formData.certificateNumber}
                  onChange={(e) => handleChange('certificateNumber', '', e.target.value)}
                  placeholder="GDG-__________"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Application Date"
                  value={formData.applicationDate}
                  onChange={(e) => handleChange('applicationDate', '', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Property Details Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              🏘️ Property Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Village Name"
                  value={formData.villageName}
                  onChange={(e) => handleChange('villageName', '', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="HOHL (Hamlet or Nearby Landmark)"
                  value={formData.hohl}
                  onChange={(e) => handleChange('hohl', '', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Survey Number(s)"
                  value={formData.surveyNumbers}
                  onChange={(e) => handleChange('surveyNumbers', '', e.target.value)}
                  helperText="e.g., 400/1, 4001 etc."
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Property Boundaries Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              🌐 Property Boundaries
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="North"
                  value={formData.boundaries?.north || ''}
                  onChange={(e) => handleChange('boundaries', 'north', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="East"
                  value={formData.boundaries?.east || ''}
                  onChange={(e) => handleChange('boundaries', 'east', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="West"
                  value={formData.boundaries?.west || ''}
                  onChange={(e) => handleChange('boundaries', 'west', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="South"
                  value={formData.boundaries?.south || ''}
                  onChange={(e) => handleChange('boundaries', 'south', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="North to South Length"
                  value={formData.boundaries?.northSouthLength || ''}
                  onChange={(e) => handleChange('boundaries', 'northSouthLength', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="East to West Length"
                  value={formData.boundaries?.eastWestLength || ''}
                  onChange={(e) => handleChange('boundaries', 'eastWestLength', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Area Details Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              📐 Area Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Area in Acres"
                  value={formData.area.acres}
                  onChange={(e) => handleChange('area', 'acres', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Area in Guntas"
                  value={formData.area.guntas}
                  onChange={(e) => handleChange('area', 'guntas', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Area in Cents"
                  value={formData.area.cents}
                  onChange={(e) => handleChange('area', 'cents', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Area in Hectares"
                  value={formData.area.hectares}
                  onChange={(e) => handleChange('area', 'hectares', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Document Details Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              📚 Document Discovery Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Book Volume"
                  value={formData.documentDetails.bookVolume}
                  onChange={(e) => handleChange('documentDetails', 'bookVolume', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Search From Date"
                  value={formData.documentDetails.searchFromDate}
                  onChange={(e) => handleChange('documentDetails', 'searchFromDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Search To Date"
                  value={formData.documentDetails.searchToDate}
                  onChange={(e) => handleChange('documentDetails', 'searchToDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ordinance / Action Taken"
                  value={formData.documentDetails.ordinance}
                  onChange={(e) => handleChange('documentDetails', 'ordinance', e.target.value)}
                  helperText="e.g., Enforcement Given, Nirvasasa, Asmi Profile, etc."
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Owner Details Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              👤 Registered Owner / Applicant
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Owner Name"
                  value={formData.ownerDetails.name}
                  onChange={(e) => handleChange('ownerDetails', 'name', e.target.value)}
                  placeholder="Sri ________________"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Father's Name"
                  value={formData.ownerDetails.fatherName}
                  onChange={(e) => handleChange('ownerDetails', 'fatherName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Bank or Legal Reference"
                  value={formData.ownerDetails.bankReference}
                  onChange={(e) => handleChange('ownerDetails', 'bankReference', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Land Details Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              🏞️ Land Type & Possession
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Type of Land</InputLabel>
                  <Select
                    value={formData.landDetails?.type || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        landDetails: {
                          ...prev.landDetails,
                          type: e.target.value
                        }
                      }));
                    }}
                    label="Type of Land"
                  >
                    <MenuItem value="agricultural">Agricultural</MenuItem>
                    <MenuItem value="non-agricultural">Non-agricultural</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Survey Reference"
                  value={formData.landDetails?.surveyReference || ''}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      landDetails: {
                        ...prev.landDetails,
                        surveyReference: e.target.value
                      }
                    }));
                  }}
                  placeholder="SY No. ________________"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Possession Type</InputLabel>
                  <Select
                    value={formData.landDetails?.possessionType || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        landDetails: {
                          ...prev.landDetails,
                          possessionType: e.target.value
                        }
                      }));
                    }}
                    label="Possession Type"
                  >
                    <MenuItem value="market">Market</MenuItem>
                    <MenuItem value="mortgage">Mortgage</MenuItem>
                    <MenuItem value="freehold">Freehold</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Any Encumbrance / Mortgage?</InputLabel>
                  <Select
                    value={formData.landDetails?.hasEncumbrance || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        landDetails: {
                          ...prev.landDetails,
                          hasEncumbrance: e.target.value
                        }
                      }));
                    }}
                    label="Any Encumbrance / Mortgage?"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="If Yes, In Favor of"
                  value={formData.landDetails?.encumbranceDetails || ''}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      landDetails: {
                        ...prev.landDetails,
                        encumbranceDetails: e.target.value
                      }
                    }));
                  }}
                  disabled={formData.landDetails?.hasEncumbrance !== 'yes'}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Reference Numbers Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              📑 Additional Reference Numbers
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Village Code / ID"
                  value={formData.referenceNumbers.villageCode}
                  onChange={(e) => handleChange('referenceNumbers', 'villageCode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Form Reference Number"
                  value={formData.referenceNumbers.formReference}
                  onChange={(e) => handleChange('referenceNumbers', 'formReference', e.target.value)}
                  placeholder="IV-__________"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Document ID"
                  value={formData.referenceNumbers.documentId}
                  onChange={(e) => handleChange('referenceNumbers', 'documentId', e.target.value)}
                  placeholder="02696-2024-25"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{
            py: 1.5,
            px: 4,
            background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
          }}
        >
          Save Form Data
        </Button>
      </Box>
    </Box>
  );
};

const RTCForm = ({ data, onChange, onSave }) => {
  const [formData, setFormData] = useState(data || {
    // Top Section
    talukSeal: '',
    taluk: '',
    hobli: '',
    village: '',
    validFrom: '',
    tillDate: '',

    // Survey Details
    surveyNumber: '',
    remuneration: {
      totalAcreCents: '',
      puttKharabA: '',
      puttKharabB: ''
    },
    revenue: {
      landRevenue: '',
      waterCharge: '',
      totalRevenue: ''
    },

    // Acquirer Details
    acquirer: {
      name: '',
      areaAcquired: '',
      pageNo: '',
      typeOfAcquirement: ''
    },

    // Portion Details
    portion: {
      area: ''
    },

    // Soil Pattern
    soilPattern: {
      soil: ''
    },

    // Trees and Irrigation
    treesAndIrrigation: {
      numberOfTrees: '',
      irrigationSource: '',
      monsoon: '',
      bagayat: ''
    },

    // Pattas
    pattas: {
      name: '',
      isOriginalLandholder: false
    },

    // Rights and Obligations
    rightsAndObligations: {
      rights: '',
      obligations: []
    },

    // Contract and Cultivation
    contractAndCultivation: {
      yearAndTime: '',
      farmers: [],
      cultivationSystem: ''
    },

    // Land Use and Crop
    landUseAndCrop: {
      contractDetails: {
        area: '',
        contract: '',
        category: ''
      },
      landUse: {
        kaulki: '',
        tari: '',
        bagayatu: ''
      },
      cropDetails: {
        name: '',
        area: {
          nonMix: '',
          mix: '',
          total: ''
        },
        irrigationSource: '',
        producePerAcre: '',
        mixedCrop: {
          name: '',
          area: ''
        }
      }
    },

    // Digital Signature
    digitalSignature: {
      signedBy: '',
      date: ''
    }
  });

  // Ensure all nested objects are initialized when data changes
  useEffect(() => {
    if (data) {
      setFormData(prevData => ({
        ...prevData,
        ...data,
        remuneration: {
          ...prevData.remuneration,
          ...(data.remuneration || {})
        },
        revenue: {
          ...prevData.revenue,
          ...(data.revenue || {})
        },
        acquirer: {
          ...prevData.acquirer,
          ...(data.acquirer || {})
        },
        portion: {
          ...prevData.portion,
          ...(data.portion || {})
        },
        soilPattern: {
          ...prevData.soilPattern,
          ...(data.soilPattern || {})
        },
        treesAndIrrigation: {
          ...prevData.treesAndIrrigation,
          ...(data.treesAndIrrigation || {})
        },
        pattas: {
          ...prevData.pattas,
          ...(data.pattas || {})
        },
        rightsAndObligations: {
          ...prevData.rightsAndObligations,
          ...(data.rightsAndObligations || {})
        },
        contractAndCultivation: {
          ...prevData.contractAndCultivation,
          ...(data.contractAndCultivation || {})
        },
        landUseAndCrop: {
          ...prevData.landUseAndCrop,
          ...(data.landUseAndCrop || {}),
          contractDetails: {
            ...prevData.landUseAndCrop.contractDetails,
            ...(data.landUseAndCrop?.contractDetails || {})
          },
          landUse: {
            ...prevData.landUseAndCrop.landUse,
            ...(data.landUseAndCrop?.landUse || {})
          },
          cropDetails: {
            ...prevData.landUseAndCrop.cropDetails,
            ...(data.landUseAndCrop?.cropDetails || {}),
            area: {
              ...prevData.landUseAndCrop.cropDetails.area,
              ...(data.landUseAndCrop?.cropDetails?.area || {})
            },
            mixedCrop: {
              ...prevData.landUseAndCrop.cropDetails.mixedCrop,
              ...(data.landUseAndCrop?.cropDetails?.mixedCrop || {})
            }
          }
        },
        digitalSignature: {
          ...prevData.digitalSignature,
          ...(data.digitalSignature || {})
        }
      }));
    }
  }, [data]);

  const handleChange = (section, field, value) => {
    setFormData(prev => {
      const newData = section.includes('.') 
        ? {
            ...prev,
            [section.split('.')[0]]: {
              ...prev[section.split('.')[0]],
              [section.split('.')[1]]: value
            }
          }
        : {
            ...prev,
            [section]: value
          };
      
      // Generate formatted text from form data
      const formattedText = formatFormDataToText(newData);
      
      // Call onChange with both form data and formatted text
      onChange(newData, formattedText);
      
      return newData;
    });
  };

  const formatFormDataToText = (data) => {
    return `RTC - Village Account Form No. 2

Basic Information:
Taluk Seal: ${data.talukSeal}
Taluk: ${data.taluk}
Hobli: ${data.hobli}
Village: ${data.village}
Valid From: ${data.validFrom}
Till Date: ${data.tillDate}

Survey Details:
Survey Number: ${data.surveyNumber}
Remuneration:
  Total Acre Cents: ${data.remuneration.totalAcreCents}
  Putt Kharab A: ${data.remuneration.puttKharabA}
  Putt Kharab B: ${data.remuneration.puttKharabB}
Revenue:
  Land Revenue: ${data.revenue.landRevenue}
  Water Charge: ${data.revenue.waterCharge}
  Total Revenue: ${data.revenue.totalRevenue}

Acquirer Details:
Name: ${data.acquirer.name}
Area Acquired: ${data.acquirer.areaAcquired}
Page No: ${data.acquirer.pageNo}
Type of Acquirement: ${data.acquirer.typeOfAcquirement}

Portion Details:
Area: ${data.portion.area}

Soil Pattern:
Soil Type: ${data.soilPattern.soil}

Trees and Irrigation:
Number of Trees: ${data.treesAndIrrigation.numberOfTrees}
Irrigation Source: ${data.treesAndIrrigation.irrigationSource}
Monsoon: ${data.treesAndIrrigation.monsoon}
Bagayat: ${data.treesAndIrrigation.bagayat}

Pattas:
Name: ${data.pattas.name}
Is Original Landholder: ${data.pattas.isOriginalLandholder ? 'Yes' : 'No'}

Rights and Obligations:
Rights: ${data.rightsAndObligations.rights}
Obligations: ${data.rightsAndObligations.obligations.join(', ')}

Contract and Cultivation:
Year and Time: ${data.contractAndCultivation.yearAndTime}
Farmers: ${data.contractAndCultivation.farmers.join(', ')}
Cultivation System: ${data.contractAndCultivation.cultivationSystem}

Land Use and Crop:
Contract Details:
  Area: ${data.landUseAndCrop.contractDetails.area}
  Contract: ${data.landUseAndCrop.contractDetails.contract}
  Category: ${data.landUseAndCrop.contractDetails.category}
Land Use:
  Kaulki: ${data.landUseAndCrop.landUse.kaulki}
  Tari: ${data.landUseAndCrop.landUse.tari}
  Bagayatu: ${data.landUseAndCrop.landUse.bagayatu}
Crop Details:
  Name: ${data.landUseAndCrop.cropDetails.name}
  Area:
    Non-Mix: ${data.landUseAndCrop.cropDetails.area.nonMix}
    Mix: ${data.landUseAndCrop.cropDetails.area.mix}
    Total: ${data.landUseAndCrop.cropDetails.area.total}
  Irrigation Source: ${data.landUseAndCrop.cropDetails.irrigationSource}
  Produce Per Acre: ${data.landUseAndCrop.cropDetails.producePerAcre}
  Mixed Crop:
    Name: ${data.landUseAndCrop.cropDetails.mixedCrop.name}
    Area: ${data.landUseAndCrop.cropDetails.mixedCrop.area}

Digital Signature:
Signed By: ${data.digitalSignature.signedBy}
Date: ${data.digitalSignature.date}`;
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        📄 RTC - Village Account Form No. 2
      </Typography>
      <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mb: 3 }}>
        Record of Rights, Tenancy and Crops (RTC) form
      </Typography>

      <Grid container spacing={3}>
        {/* Top Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              📋 Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Taluk Seal"
                  value={formData.talukSeal}
                  onChange={(e) => handleChange('talukSeal', '', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Taluk"
                  value={formData.taluk}
                  onChange={(e) => handleChange('taluk', '', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Hobli"
                  value={formData.hobli}
                  onChange={(e) => handleChange('hobli', '', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Village"
                  value={formData.village}
                  onChange={(e) => handleChange('village', '', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Valid From"
                  value={formData.validFrom}
                  onChange={(e) => handleChange('validFrom', '', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Till Date"
                  value={formData.tillDate}
                  onChange={(e) => handleChange('tillDate', '', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Survey Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              📐 Survey Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Survey Number"
                  value={formData.surveyNumber}
                  onChange={(e) => handleChange('surveyNumber', '', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Total Acre Cents"
                  value={formData.remuneration.totalAcreCents}
                  onChange={(e) => handleChange('remuneration', 'totalAcreCents', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Putt Kharab (a)"
                  value={formData.remuneration.puttKharabA}
                  onChange={(e) => handleChange('remuneration', 'puttKharabA', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Putt Kharab (b)"
                  value={formData.remuneration.puttKharabB}
                  onChange={(e) => handleChange('remuneration', 'puttKharabB', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Revenue Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              💰 Revenue Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Land Revenue"
                  value={formData.revenue.landRevenue}
                  onChange={(e) => handleChange('revenue', 'landRevenue', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Water Charge"
                  value={formData.revenue.waterCharge}
                  onChange={(e) => handleChange('revenue', 'waterCharge', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Total Revenue"
                  value={formData.revenue.totalRevenue}
                  onChange={(e) => handleChange('revenue', 'totalRevenue', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Acquirer Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              👤 Acquirer Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Acquirer Name"
                  value={formData.acquirer.name}
                  onChange={(e) => handleChange('acquirer', 'name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Area Acquired"
                  value={formData.acquirer.areaAcquired}
                  onChange={(e) => handleChange('acquirer', 'areaAcquired', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Page No."
                  value={formData.acquirer.pageNo}
                  onChange={(e) => handleChange('acquirer', 'pageNo', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Type of Acquirement"
                  value={formData.acquirer.typeOfAcquirement}
                  onChange={(e) => handleChange('acquirer', 'typeOfAcquirement', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Soil Pattern */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              🌱 Soil Pattern
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Soil Type</InputLabel>
                  <Select
                    value={formData.soilPattern.soil || ''}
                    onChange={(e) => handleChange('soilPattern', 'soil', e.target.value)}
                    label="Soil Type"
                  >
                    {soilTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Trees and Irrigation */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              💧 Irrigation Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of Trees"
                  value={formData.treesAndIrrigation.numberOfTrees || ''}
                  onChange={(e) => handleChange('treesAndIrrigation', 'numberOfTrees', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Irrigation Source</InputLabel>
                  <Select
                    value={formData.treesAndIrrigation.irrigationSource || ''}
                    onChange={(e) => handleChange('treesAndIrrigation', 'irrigationSource', e.target.value)}
                    label="Irrigation Source"
                  >
                    {irrigationSources.map((source) => (
                      <MenuItem key={source} value={source}>
                        {source}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Contract and Cultivation */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              👨‍🌾 Contract and Cultivation
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Year and Time"
                  value={formData.contractAndCultivation.yearAndTime || ''}
                  onChange={(e) => handleChange('contractAndCultivation', 'yearAndTime', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Cultivation System</InputLabel>
                  <Select
                    value={formData.contractAndCultivation.cultivationSystem || ''}
                    onChange={(e) => handleChange('contractAndCultivation', 'cultivationSystem', e.target.value)}
                    label="Cultivation System"
                  >
                    {cultivationSystems.map((system) => (
                      <MenuItem key={system} value={system}>
                        {system}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Farmers"
                  value={formData.contractAndCultivation.farmers.join('\n') || ''}
                  onChange={(e) => handleChange('contractAndCultivation', 'farmers', e.target.value.split('\n'))}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Land Use and Crop */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              🌾 Land Use and Crop
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Land Use Type</InputLabel>
                  <Select
                    value={formData.landUseAndCrop?.landUse?.kaulki || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        landUseAndCrop: {
                          ...prev.landUseAndCrop,
                          landUse: {
                            ...prev.landUseAndCrop?.landUse,
                            kaulki: e.target.value
                          }
                        }
                      }));
                    }}
                    label="Land Use Type"
                  >
                    {landUseTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Crop Type</InputLabel>
                  <Select
                    value={formData.landUseAndCrop?.cropDetails?.name || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        landUseAndCrop: {
                          ...prev.landUseAndCrop,
                          cropDetails: {
                            ...prev.landUseAndCrop?.cropDetails,
                            name: e.target.value
                          }
                        }
                      }));
                    }}
                    label="Crop Type"
                  >
                    {cropTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Irrigation Source</InputLabel>
                  <Select
                    value={formData.landUseAndCrop?.cropDetails?.irrigationSource || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        landUseAndCrop: {
                          ...prev.landUseAndCrop,
                          cropDetails: {
                            ...prev.landUseAndCrop?.cropDetails,
                            irrigationSource: e.target.value
                          }
                        }
                      }));
                    }}
                    label="Irrigation Source"
                  >
                    {irrigationSources.map((source) => (
                      <MenuItem key={source} value={source}>
                        {source}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Digital Signature */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              ✍️ Digital Signature
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Signed By"
                  value={formData.digitalSignature.signedBy}
                  onChange={(e) => handleChange('digitalSignature', 'signedBy', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date"
                  value={formData.digitalSignature.date}
                  onChange={(e) => handleChange('digitalSignature', 'date', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{
            py: 1.5,
            px: 4,
            background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
          }}
        >
          Save Form Data
        </Button>
      </Box>
    </Box>
  );
};

// Add debounce utility function at the top of the file, before the App component
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function App() {
  // State variables
  const [activeStep, setActiveStep] = useState(0);
  const [sessionId, setSessionId] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState({
    status: '',
    message: '',
    progress: 0,
    currentStage: '',
    totalPages: 0,
    processedPages: 0
  });
  const [missingDocuments, setMissingDocuments] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState({
    rawText: '',
    translatedText: '',
    editedText: '',
    formData: null,
  });
  const [pageImage, setPageImage] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [reportResult, setReportResult] = useState('');
  const [editableReport, setEditableReport] = useState('');
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [clientName, setClientName] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [pollingInterval, setPollingInterval] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [pageInput, setPageInput] = useState('');
  const [rotation, setRotation] = useState(0);
  const [textTabValue, setTextTabValue] = useState(0);
  const [editedPages, setEditedPages] = useState({}); // Add this new state
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [poorQualityPages, setPoorQualityPages] = useState([]);
  
  // Handle file upload
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  
  // Upload file and start processing
  const handleUpload = async () => {
    if (!file) {
      showAlert('Please select a file to upload', 'error');
      return;
    }
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData);
      setSessionId(response.data.session_id);
      showAlert('File uploaded successfully', 'success');
      startStatusPolling(response.data.session_id);
    } catch (error) {
      console.error('Error uploading file:', error);
      showAlert('Error uploading file: ' + (error.response?.data?.detail || error.message), 'error');
    } finally {
      setUploading(false);
    }
  };
  
  // Poll for processing status
  const startStatusPolling = (id) => {
    // Clear any existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    // Start new polling
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/status/${id}`);
        const status = response.data;
        
        setProcessingStatus({
          status: status.status,
          message: status.message,
          progress: status.progress,
          currentStage: status.current_stage,
          totalPages: status.total_pages,
          processedPages: status.processed_pages
        });
        
        // Move to next step if processing is complete
        if (status.status === 'ready_for_review') {
          clearInterval(interval);
          setPollingInterval(null);
          loadPageData(id, 1);
          setActiveStep(1); // Move to Quality Check step
          
          // Fetch poor quality pages
          try {
            const poorQualityResponse = await axios.get(`${API_BASE_URL}/poor-quality-pages/${id}`);
            setPoorQualityPages(poorQualityResponse.data);
          } catch (error) {
            console.error('Error fetching poor quality pages:', error);
            showAlert('Error fetching poor quality pages', 'error');
          }
        } else if (status.status === 'completed' || status.status === 'completed_with_warning') {
          clearInterval(interval);
          setPollingInterval(null);
          fetchReportResult(id);
          setActiveStep(4); // Move to Edit & Download Results step
          showAlert('Report generated successfully!', 'success');
        } else if (status.status === 'error') {
          clearInterval(interval);
          setPollingInterval(null);
          showAlert(`Error: ${status.message}`, 'error');
        }
      } catch (error) {
        console.error('Error fetching status:', error);
        showAlert('Error fetching processing status', 'error');
        clearInterval(interval);
        setPollingInterval(null);
      }
    }, 2000);
    
    setPollingInterval(interval);
  };
  
  // Load page data for review
  const loadPageData = async (id, pageNum) => {
    try {
      // Fetch page data
      const pageResponse = await axios.get(`${API_BASE_URL}/pages/${id}/${pageNum}`);
      const imageResponse = await axios.get(`${API_BASE_URL}/image/${id}/${pageNum}`);
      
      setRotation(0); // Reset rotation when changing pages
      
      // Check if we have edited text for this page
      const editedText = editedPages[pageNum];
      
      setPageData({
        rawText: editedText || pageResponse.data.raw_text,
        translatedText: editedText || pageResponse.data.translated_text,
        editedText: editedText || pageResponse.data.translated_text,
        formData: pageResponse.data.form_data,
      });
      
      setPageImage(imageResponse.data.image);
      setCurrentPage(pageNum);
    } catch (error) {
      console.error('Error loading page data:', error);
      showAlert('Error loading page data', 'error');
    }
  };
  
  // Update page text
  const handleTextUpdate = async () => {
    try {
      const textToUpdate = tabValue === 0 ? pageData.translatedText : pageData.rawText;
      
      // Save the edited text to our editedPages state
      setEditedPages(prev => ({
        ...prev,
        [currentPage]: textToUpdate
      }));

      await axios.put(`${API_BASE_URL}/update-page/${sessionId}`, {
        page_number: currentPage,
        edited_text: textToUpdate
      });
      
      showAlert('Page updated successfully', 'success');
    } catch (error) {
      console.error('Error updating page:', error);
      showAlert('Error updating page', 'error');
    }
  };
  
  // Generate report
  const handleGenerateReport = async () => {
    try {
      setProcessingStatus(prev => ({
        ...prev,
        status: 'generating_report',
        message: 'Starting report generation',
        progress: 0
      }));

      await axios.post(`${API_BASE_URL}/generate-report/${sessionId}`, {
        session_id: sessionId,
        client_name: clientName || 'Client' // Use default if not provided
      });
      
      showAlert('Report generation started', 'info');
      startStatusPolling(sessionId);
    } catch (error) {
      console.error('Error starting report generation:', error);
      showAlert('Error starting report generation: ' + (error.response?.data?.detail || error.message), 'error');
      setProcessingStatus(prev => ({
        ...prev,
        status: 'error',
        message: 'Error generating report'
      }));
    }
  };
  
  // Fetch report result
  const fetchReportResult = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/status/${id}`);
      if (response.data.status === 'completed' || response.data.status === 'completed_with_warning') {
        const reportText = response.data.final_output || 'Report generated successfully!';
        setReportResult(reportText);
        setEditableReport(reportText);
      }
    } catch (error) {
      console.error('Error fetching report result:', error);
      showAlert('Error fetching report result: ' + (error.response?.data?.detail || error.message), 'error');
    }
  };
  
  // Download report
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Use the most up-to-date content
      const contentToDownload = isEditingReport ? editableReport : reportResult;
      
      // Log the content being sent
      console.log('Content being downloaded:', contentToDownload);
      
      // Encode the report content for URL
      const encodedContent = encodeURIComponent(contentToDownload);
      console.log('Encoded content length:', encodedContent.length);
      
      // Try to download as DOCX first
      const docxUrl = `${API_BASE_URL}/download/${sessionId}/docx?content=${encodedContent}`;
      console.log('DOCX request URL:', docxUrl);
      
      const docxResponse = await fetch(docxUrl);
      
      if (!docxResponse.ok) {
        const docxError = await docxResponse.text();
        console.error('DOCX download failed:', docxError);
        
        // If DOCX fails, try markdown
        const mdUrl = `${API_BASE_URL}/download/${sessionId}/markdown?content=${encodedContent}`;
        console.log('Markdown request URL:', mdUrl);
        
        const mdResponse = await fetch(mdUrl);
        
        if (!mdResponse.ok) {
          const mdError = await mdResponse.text();
          console.error('Markdown download failed:', mdError);
          throw new Error(`Download failed: ${mdError || 'Unknown error'}`);
        }
        
        // Log the response headers
        console.log('Markdown response headers:', Object.fromEntries(mdResponse.headers.entries()));
        
        const blob = await mdResponse.blob();
        console.log('Received blob size:', blob.size);
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.md';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Log the response headers
        console.log('DOCX response headers:', Object.fromEntries(docxResponse.headers.entries()));
        
        const blob = await docxResponse.blob();
        console.log('Received blob size:', blob.size);
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report Sy 91_2.docx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      showAlert('Document downloaded successfully', 'success');
    } catch (error) {
      console.error('Download error details:', error);
      showAlert(`Download failed: ${error.message}`, 'error');
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Show alert message
  const showAlert = (message, severity = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenAlert(true);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Navigate pages
  const handlePrevPage = () => {
    if (currentPage > 1) {
      loadPageData(sessionId, currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < processingStatus.totalPages) {
      loadPageData(sessionId, currentPage + 1);
    }
  };
  
  // Handle text editing
  const handleTextEdit = (event) => {
    if (tabValue === 0) {
      setPageData({ ...pageData, translatedText: event.target.value });
    } else {
      setPageData({ ...pageData, rawText: event.target.value });
    }
  };
  
  // Toggle report editing mode
  const toggleReportEditing = () => {
    if (isEditingReport) {
      // Save changes
      setReportResult(editableReport);
      // Also update the editableReport to ensure consistency
      setEditableReport(editableReport);
      showAlert('Report saved successfully', 'success');
    }
    setIsEditingReport(!isEditingReport);
  };

  // Handle report editing
  const handleReportEdit = (event) => {
    const newContent = event.target.value;
    setEditableReport(newContent);
    // Also update reportResult to keep them in sync
    setReportResult(newContent);
  };
  
  // Reset the application
  const handleReset = () => {
    setActiveStep(0);
    setSessionId('');
    setFile(null);
    setProcessingStatus({
      status: '',
      message: '',
      progress: 0,
      currentStage: '',
      totalPages: 0,
      processedPages: 0
    });
    setCurrentPage(1);
    setPageData({
      rawText: '',
      translatedText: '',
      editedText: '',
      formData: null,
    });
    setPageImage('');
    setTabValue(0);
    setReportResult('');
    setEditableReport('');
    setIsEditingReport(false);
    setClientName('');
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setRotation(0);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Calculate boundaries
      const container = containerRef.current;
      const image = imageRef.current;
      if (container && image) {
        const maxX = (image.offsetWidth * zoomLevel - container.offsetWidth) / 2;
        const maxY = (image.offsetHeight * zoomLevel - container.offsetHeight) / 2;
        
        setImagePosition({
          x: Math.max(Math.min(newX, maxX), -maxX),
          y: Math.max(Math.min(newY, maxY), -maxY)
        });
      }
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Add new handler for direct page navigation
  const handlePageInputChange = (event) => {
    const value = event.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  const handlePageInputSubmit = (event) => {
    if (event.key === 'Enter' && pageInput !== '') {
      const pageNum = parseInt(pageInput);
      if (pageNum >= 1 && pageNum <= processingStatus.totalPages) {
        loadPageData(sessionId, pageNum);
      } else {
        showAlert(`Please enter a page number between 1 and ${processingStatus.totalPages}`, 'warning');
      }
      setPageInput('');
    }
  };
  
  // Add rotation handlers
  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  // Add new functions for document analysis
  const handleAdditionalFileUpload = (event, documentId) => {
    const file = event.target.files[0];
    if (file) {
      setAdditionalFiles(prev => [...prev, { documentId, file }]);
      setMissingDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId ? { ...doc, uploaded: true } : doc
        )
      );
    }
  };

  const handleProceedWithoutDocuments = () => {
    setShowWarning(false);
    setActiveStep(3); // Move to Generate Report step
  };

  // Add this function near your other document-related functions
  const handleAnalyzeDocuments = async () => {
    try {
      // Use the text from the currently selected tab
      const textToAnalyze = textTabValue === 0 ? pageData.translatedText : pageData.rawText;
      if (!textToAnalyze) {
        showAlert('No text available for analysis', 'warning');
        return;
      }

      setProcessingStatus({
        status: 'processing',
        message: 'Analyzing documents...',
        progress: 0
      });

      const response = await fetch('/document-suggestions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chunk_text: textToAnalyze }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze documents');
      }

      const missingDocs = await response.json();
      setMissingDocuments(missingDocs);

      if (missingDocs.length === 0) {
        setProcessingStatus({
          status: 'completed',
          message: 'All required documents are present',
          progress: 100
        });
        showAlert('All required documents are present', 'success');
        setActiveStep(3);
      } else {
        setProcessingStatus({
          status: 'completed_with_warning',
          message: `Missing ${missingDocs.length} required document(s)`,
          progress: 100
        });
        setShowWarning(true);
      }
    } catch (error) {
      console.error('Error analyzing documents:', error);
      setProcessingStatus({
        status: 'error',
        message: 'Failed to analyze documents',
        progress: 0
      });
      showAlert('Error analyzing documents. Please try again.', 'error');
    }
  };

  // Update the fetchDocumentSuggestions function to use handleAnalyzeDocuments
  const fetchDocumentSuggestions = async (text) => {
    if (!text || text.trim() === '') {
      return;
    }
    await handleAnalyzeDocuments();
  };

  // Add feedback handlers
  const handleFeedbackSubmit = () => {
    if (feedbackRating > 0) {
      console.log('Feedback submitted:', { rating: feedbackRating });
      setFeedbackSubmitted(true);
      showAlert('Thank you for your feedback!', 'success');
    }
  };

  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Paper
              sx={{
                p: 4,
                mb: 4,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                borderRadius: 3,
                border: '2px dashed',
                borderColor: 'primary.light',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
                  }}
                >
                  Select PDF File
                </Button>
              </label>

              {file && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  Selected file: {file.name}
                </Typography>
              )}

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  sx={{
                    minWidth: 200,
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
                  }}
                >
                  {uploading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Upload & Process'
                  )}
                </Button>
              </Box>

              {processingStatus.status && (
                <Box sx={{ mt: 4, width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={processingStatus.progress * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(44, 62, 80, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    {processingStatus.message}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {processingStatus.processedPages} / {processingStatus.totalPages} pages processed
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        );
        
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 3,
              }}
            >
              Review and Edit OCR Results
            </Typography>

            {poorQualityPages.length > 0 && (
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem',
                    color: '#c62828',
                  },
                  '& .MuiAlert-message': {
                    color: '#c62828',
                  }
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: '#c62828' }}>
                  Pages Requiring Manual Intervention
                </Typography>
                <Typography variant="body2" sx={{ color: '#c62828' }}>
                  The following pages have been identified as having poor quality and require manual review: {' '}
                  <Box component="span" sx={{ display: 'inline-flex', gap: 1 }}>
                    {poorQualityPages.map((pageNum) => (
                      <Button
                        key={pageNum}
                        size="small"
                        variant="outlined"
                        onClick={() => loadPageData(sessionId, pageNum)}
                        sx={{
                          minWidth: 'auto',
                          px: 1,
                          py: 0.5,
                          fontSize: '0.875rem',
                          borderColor: '#c62828',
                          color: '#c62828',
                          '&:hover': {
                            borderColor: '#b71c1c',
                            backgroundColor: 'rgba(198, 40, 40, 0.08)',
                          },
                        }}
                      >
                        Page {pageNum}
                      </Button>
                    ))}
                  </Box>
                </Typography>
              </Alert>
            )}

            <Paper 
              sx={{ 
                p: 2,
                mb: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
              }}>
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(44, 62, 80, 0.08)',
                    },
                  }}
                >
                  Previous
                </Button>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2 
                }}>
                  <Typography sx={{ fontWeight: 500 }}>
                    Page {currentPage} of {processingStatus.totalPages}
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Go to page"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onKeyDown={handlePageInputSubmit}
                    sx={{
                      width: '100px',
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        '& input': {
                          padding: '4px 8px',
                          textAlign: 'center',
                        },
                      },
                    }}
                    inputProps={{
                      min: 1,
                      max: processingStatus.totalPages,
                      style: { textAlign: 'center' }
                    }}
                  />
                </Box>

                <Button
                  onClick={handleNextPage}
                  disabled={currentPage >= processingStatus.totalPages}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(44, 62, 80, 0.08)',
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            </Paper>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    height: 'calc(100vh - 300px)', 
                    minHeight: '600px',
                    overflow: 'hidden',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    position: 'relative',
                  }}
                  ref={containerRef}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2,
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      PDF Page
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={handleRotateLeft}
                        sx={{ minWidth: 'auto', p: 1 }}
                        title="Rotate Left"
                      >
                        <RotateLeftIcon />
                      </Button>
                      <Button
                        size="small"
                        onClick={handleRotateRight}
                        sx={{ minWidth: 'auto', p: 1 }}
                        title="Rotate Right"
                      >
                        <RotateRightIcon />
                      </Button>
                      <Button
                        size="small"
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 0.5}
                        sx={{ minWidth: 'auto', p: 1 }}
                        title="Zoom Out"
                      >
                        <ZoomOutIcon />
                      </Button>
                      <Button
                        size="small"
                        onClick={handleReset}
                        sx={{ minWidth: 'auto', p: 1 }}
                        title="Reset View"
                      >
                        {Math.round(zoomLevel * 100)}%
                      </Button>
                      <Button
                        size="small"
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 3}
                        sx={{ minWidth: 'auto', p: 1 }}
                        title="Zoom In"
                      >
                        <ZoomInIcon />
                      </Button>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    position: 'relative',
                    width: '100%',
                    height: 'calc(100% - 48px)',
                    overflow: 'hidden',
                    cursor: zoomLevel > 1 ? 'grab' : 'default',
                    '&:active': {
                      cursor: zoomLevel > 1 ? 'grabbing' : 'default',
                    },
                  }}>
                    {pageImage ? (
                      <img 
                        ref={imageRef}
                        src={`data:image/png;base64,${pageImage}`} 
                        alt={`Page ${currentPage}`}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px) rotate(${rotation}deg)`,
                          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transformOrigin: 'center center',
                        }}
                        onMouseDown={handleMouseDown}
                      />
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%' 
                      }}>
                        <CircularProgress />
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    height: 'calc(100vh - 300px)',
                    minHeight: '600px',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Choose Editing Mode
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant={tabValue === 0 ? "contained" : "outlined"}
                        onClick={() => setTabValue(0)}
                        sx={{
                          flex: 1,
                          py: 1.5,
                          ...(tabValue === 0 ? {
                            background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
                          } : {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              backgroundColor: 'rgba(44, 62, 80, 0.08)',
                            },
                          }),
                        }}
                      >
                        Direct Text Editing
                      </Button>
                      <Button
                        variant={tabValue === 1 ? "contained" : "outlined"}
                        onClick={() => setTabValue(1)}
                        sx={{
                          flex: 1,
                          py: 1.5,
                          ...(tabValue === 1 ? {
                            background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
                          } : {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              backgroundColor: 'rgba(44, 62, 80, 0.08)',
                            },
                          }),
                        }}
                      >
                        Structured Form
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {tabValue === 0 ? (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Tabs 
                          value={textTabValue} 
                          onChange={(e, newValue) => setTextTabValue(newValue)}
                          sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '& .MuiTab-root': {
                              textTransform: 'none',
                              fontWeight: 500,
                              minWidth: 120,
                            },
                          }}
                        >
                          <Tab label="Translated Text" />
                          <Tab label="Raw OCR Text" />
                        </Tabs>

                        <Box sx={{ flex: 1, mt: 2, overflow: 'auto' }}>
                          <TextField
                            label={textTabValue === 0 ? "Translated Text (Editable)" : "Raw OCR Text (Editable)"}
                            multiline
                            fullWidth
                            rows={20}
                            value={textTabValue === 0 ? pageData.translatedText : pageData.rawText}
                            onChange={(e) => {
                              if (textTabValue === 0) {
                                setPageData(prev => ({
                                  ...prev,
                                  translatedText: e.target.value
                                }));
                              } else {
                                setPageData(prev => ({
                                  ...prev,
                                  rawText: e.target.value
                                }));
                              }
                            }}
                            variant="outlined"
                            sx={{
                              height: '100%',
                              '& .MuiOutlinedInput-root': {
                                height: '100%',
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                height: '100% !important',
                              },
                            }}
                          />
                        </Box>

                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          mt: 2,
                          gap: 2,
                        }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleTextUpdate}
                            sx={{
                              flex: 1,
                              py: 1.5,
                              background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
                            }}
                          >
                            Save Changes
                          </Button>

                          <Button
                            variant="contained"
                            color="secondary"
                            endIcon={<NavigateNextIcon />}
                            onClick={() => setActiveStep(2)}
                            sx={{
                              flex: 1,
                              py: 1.5,
                              background: 'linear-gradient(45deg, #E74C3C 30%, #EC7063 90%)',
                            }}
                          >
                            Proceed to Document Analysis
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {!pageData.selectedForm ? (
                          <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                              Select Form Type
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                              Choose the appropriate form type for your document
                            </Typography>
                            <Grid container spacing={2}>
                              {AVAILABLE_FORMS.map((form) => (
                                <Grid item xs={12} key={form.id}>
                                  <Card 
                                    sx={{ 
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                      },
                                    }}
                                    onClick={() => {
                                      setPageData(prev => ({
                                        ...prev,
                                        selectedForm: form.id
                                      }));
                                    }}
                                  >
                                    <CardContent>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="h4" sx={{ color: 'primary.main' }}>
                                          {form.icon}
                                        </Typography>
                                        <Box>
                                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {form.name}
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                            {form.description}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        ) : (
                          <Box sx={{ flex: 1, overflow: 'auto' }}>
                            {pageData.selectedForm === 'form15' && (
                              <Form15Application
                                data={pageData.formData}
                                onChange={(newData, formattedText) => {
                                  setPageData(prev => ({
                                    ...prev,
                                    formData: newData,
                                    translatedText: formattedText
                                  }));
                                }}
                                onSave={handleTextUpdate}
                              />
                            )}
                            {pageData.selectedForm === 'rtc' && (
                              <RTCForm
                                data={pageData.formData}
                                onChange={(newData, formattedText) => {
                                  setPageData(prev => ({
                                    ...prev,
                                    formData: newData,
                                    translatedText: formattedText
                                  }));
                                }}
                                onSave={handleTextUpdate}
                              />
                            )}
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              mt: 2,
                              gap: 2,
                            }}>
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setPageData(prev => ({
                                    ...prev,
                                    selectedForm: null
                                  }));
                                }}
                                sx={{
                                  py: 1.5,
                                  borderColor: 'primary.main',
                                  color: 'primary.main',
                                  '&:hover': {
                                    borderColor: 'primary.dark',
                                    backgroundColor: 'rgba(44, 62, 80, 0.08)',
                                  },
                                }}
                              >
                                Change Form Type
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                endIcon={<NavigateNextIcon />}
                                onClick={() => setActiveStep(2)}
                                sx={{
                                  py: 1.5,
                                  background: 'linear-gradient(45deg, #E74C3C 30%, #EC7063 90%)',
                                }}
                              >
                                Proceed to Document Analysis
                              </Button>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
        
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 3,
              }}
            >
              Document Analysis
            </Typography>
            <Paper 
              sx={{ 
                p: 4, 
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  color: 'text.secondary',
                  mb: 4,
                }}
              >
                Our system has analyzed your uploaded documents and identified some missing documents that may be required for accurate processing.
              </Typography>
              <Grid container spacing={3}>
                {missingDocuments.map((doc) => (
                  <Grid item xs={12} key={doc.id}>
                    <Paper
                      sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid',
                        borderColor: doc.uploaded ? 'success.main' : 'warning.main',
                        bgcolor: doc.uploaded ? 'success.light' : 'warning.light',
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {doc.name}
                          {doc.required && (
                            <Typography
                              component="span"
                              sx={{
                                ml: 1,
                                color: 'error.main',
                                fontSize: '0.875rem',
                              }}
                            >
                              (Required)
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doc.uploaded ? 'Document uploaded' : 'Document missing'}
                        </Typography>
                      </Box>
                      <Box>
                        <input
                          accept="application/pdf"
                          style={{ display: 'none' }}
                          id={`file-upload-${doc.id}`}
                          type="file"
                          onChange={(e) => handleAdditionalFileUpload(e, doc.id)}
                          disabled={doc.uploaded}
                        />
                        <label htmlFor={`file-upload-${doc.id}`}>
                          <Button
                            variant="contained"
                            component="span"
                            disabled={doc.uploaded}
                            sx={{
                              bgcolor: doc.uploaded ? 'success.main' : 'primary.main',
                              '&:hover': {
                                bgcolor: doc.uploaded ? 'success.dark' : 'primary.dark',
                              },
                            }}
                          >
                            {doc.uploaded ? 'Uploaded' : 'Upload'}
                          </Button>
                        </label>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAnalyzeDocuments}
                  sx={{
                    minWidth: 200,
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
                  }}
                >
                  Continue to Report Generation
                </Button>
              </Box>
            </Paper>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 3,
              }}
            >
              Generate Report
            </Typography>
            <Paper 
              sx={{ 
                p: 4, 
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  color: 'text.secondary',
                  mb: 4,
                }}
              >
                Enter client information for the report and click "Generate" to create your legal document report.
              </Typography>
              <TextField
                label="Client Name (Optional)"
                fullWidth
                margin="normal"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                helperText="This will appear in the report header. Leave empty to use default."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateReport}
                  disabled={processingStatus.status === 'generating_report'}
                  startIcon={processingStatus.status === 'generating_report' ? <CircularProgress size={20} /> : <ReportIcon />}
                  sx={{
                    minWidth: 200,
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
                  }}
                >
                  {processingStatus.status === 'generating_report' ? 'Generating...' : 'Generate Report'}
                </Button>
              </Box>
              {processingStatus.status === 'generating_report' && (
                <Box sx={{ mt: 4, width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={processingStatus.progress * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(44, 62, 80, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
                      },
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 2,
                      color: 'text.secondary',
                    }}
                  >
                    {processingStatus.message}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 3,
              }}
            >
              Report Generated Successfully
            </Typography>
            <Paper 
              sx={{ 
                p: 4, 
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 3,
                gap: 2,
              }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isEditingReport ? <SaveIcon /> : <EditIcon />}
                  onClick={toggleReportEditing}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)',
                  }}
                >
                  {isEditingReport ? 'Save Edits' : 'Edit Report'}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                  onClick={handleDownload}
                  disabled={isDownloading}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #E74C3C 30%, #EC7063 90%)',
                  }}
                >
                  Download as DOCX
                </Button>
              </Box>

              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                }}
              >
                Report Content:
              </Typography>
              {isEditingReport ? (
                <TextField
                  multiline
                  fullWidth
                  minRows={20}
                  maxRows={40}
                  variant="outlined"
                  value={editableReport}
                  onChange={handleReportEdit}
                  sx={{ 
                    mt: 2,
                    fontFamily: '"Noto Sans Bengali", "SolaimanLipi", "Vrinda", "Arial Unicode MS", sans-serif',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              ) : (
                <Paper 
                  sx={{ 
                    p: 3, 
                    mt: 2, 
                    maxHeight: '600px', 
                    overflow: 'auto', 
                    backgroundColor: '#f8f9fa',
                    borderRadius: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                  className="markdown-container"
                >
                  <style>{markdownStyles}</style>
                  {reportResult ? (
                    <Markdown
                      options={{
                        overrides: {
                          img: {
                            component: ({ src, alt, ...props }) => {
                              // Handle base64 encoded images (like the logo)
                              if (src && src.startsWith('data:image/')) {
                                return <img src={src} alt={alt} {...props} />;
                              }
                              // Handle regular image URLs
                              return <img src={src} alt={alt} {...props} />;
                            }
                          }
                        }
                      }}
                    >
                      {editableReport}
                    </Markdown>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      p: 4,
                      gap: 2,
                    }}>
                      <CircularProgress />
                      <Typography>Loading report content...</Typography>
                    </Box>
                  )}
                </Paper>
              )}

              {/* Feedback Section */}
              {!feedbackSubmitted && (
                <Box sx={{ 
                  mt: 4,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  textAlign: 'center',
                }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    How would you rate your experience?
                  </Typography>
                  <Rating
                    name="feedback-rating"
                    value={feedbackRating}
                    onChange={(event, newValue) => {
                      setFeedbackRating(newValue);
                      if (newValue > 0) {
                        handleFeedbackSubmit();
                      }
                    }}
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: 'primary.main',
                      },
                      '& .MuiRating-iconHover': {
                        color: 'primary.light',
                      },
                    }}
                  />
                </Box>
              )}
            </Paper>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'rgba(44, 62, 80, 0.08)',
                  },
                }}
              >
                Process Another Document
              </Button>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };
  
  // Simplify the warning dialog
  const renderWarningDialog = () => (
    <Dialog
      open={showWarning}
      onClose={() => setShowWarning(false)}
    >
      <DialogTitle>Missing Documents</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The following documents are missing:
          <List>
            {missingDocuments.map((doc, index) => (
              <ListItem key={index}>
                <ListItemText primary={doc.name} />
              </ListItem>
            ))}
          </List>
          Would you like to proceed anyway?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowWarning(false)}>Cancel</Button>
        <Button onClick={handleProceedWithoutDocuments}>Proceed Anyway</Button>
      </DialogActions>
    </Dialog>
  );

  // Add ResizeObserver polyfill and error handling inside the App component
  useEffect(() => {
    const resizeObserverError = debounce(() => {
      const resizeObserverError = new Error('ResizeObserver loop completed with undelivered notifications.');
      resizeObserverError.name = 'ResizeObserverError';
      window.dispatchEvent(new ErrorEvent('error', { error: resizeObserverError }));
    }, 100);

    const resizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries)) return;
        if (!entries.length) return;
        entries.forEach(() => {
          resizeObserverError();
        });
      });
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar sx={{ py: 2 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 600,
                letterSpacing: '-0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <img 
                src="/foxmandal-logo.png" 
                alt="Logo" 
                style={{ height: 100, marginRight: 8 }} 
              />
              Fox Mandal OCR-AI | Legal Document Processor
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Paper 
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            }}
          >
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel
              sx={{
                '& .MuiStepLabel-root': {
                  '& .MuiStepLabel-label': {
                    color: 'text.secondary',
                    '&.Mui-active': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                    '&.Mui-completed': {
                      color: 'primary.main',
                    },
                  },
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Box sx={{ mt: 4 }}>
              {getStepContent(activeStep)}
            </Box>
          </Paper>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                opacity: 0.8,
                fontSize: '0.875rem',
              }}
            >
              © {new Date().getFullYear()} Fox Mandal & Associates. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
      
      <Snackbar 
        open={openAlert} 
        autoHideDuration={6000} 
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiAlert-root': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Alert 
          onClose={() => setOpenAlert(false)} 
          severity={alertSeverity} 
          sx={{ 
            width: '100%',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      {renderWarningDialog()}
    </ThemeProvider>
  );
}

export default App;