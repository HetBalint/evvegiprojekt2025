function Validation(values) {
    
    let errors = {};
  
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    
  if (!values.email) {
    errors.email = "Hibás email-cím";
  } else if (!email_pattern.test(values.email)) {
    errors.email = "Hibás email formátum";
  }

  if (!values.jelszo) {
    errors.jelszo = "Hibás jelszó";
  } else if (!password_pattern.test(values.jelszo)) {
    errors.jelszo =
      "A jelszónak minimum 6 karakter hossúnak kell lennie és tratalmaznia kell betűt és számot is.";
  }

  return errors;
}
    
export default Validation;