#include <Servo.h>

Servo servo1;

void setup() {
  servo1.attach(3);
}

void loop() {
  // ABRE a portinha (90 graus)
  servo1.write(90);
  delay(2000); 

  // FECHA a portinha (0 graus)
  servo1.write(0);
  delay(2000); 
}