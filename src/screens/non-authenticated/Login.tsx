import React from "react";
import styles from "./Login.module.scss"; // Import the SCSS file
import Button from "@mui/material/Button";
import { Box, InputAdornment, TextField } from "@mui/material";
import Smartphone from "@mui/icons-material/Smartphone";

export function Login() {
  return (
    <Box className={styles.container}>
      <Box className={styles.buttonContainer}>
        <TextField
          className={styles.phoneInput}
          fullWidth
          id="outlined-number"
          label="Ingrese su celular o código asignado"
          type="number"
          //   value=""
          variant="standard"
          InputLabelProps={{ shrink: true }}
          inputProps={{ maxLength: 12 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Smartphone />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box className={styles.buttonContainer}>
        <Button fullWidth variant="outlined" className={styles.button}>
          Reportar Presencia
        </Button>
      </Box>
      <Box className={styles.buttonContainer}>
        <Button fullWidth variant="contained" className={styles.button}>
          Ingresar
        </Button>
      </Box>
      {/* <IconButton>
        <MenuIcon />
      </IconButton> */}
    </Box>
  );
}
