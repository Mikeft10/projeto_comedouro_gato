import cv2
import numpy
import tensorflow as tf
import serial
import time

# Carrega o modelo TFLite (evita o erro de compatibilidade de versões)
interpreter = tf.lite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()

# Pega detalhes de entrada e saída do modelo
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Tenta conectar ao Arduino (troque 'COM3' pela sua porta)
try:
    arduino = serial.Serial('COM3', 9600, timeout=1)
    time.sleep(2)  # Aguarda a porta serial estabilizar
    print("Arduino conectado com sucesso!")
except Exception as e:
    print(f"Erro ao conectar no Arduino: {e}")
    arduino = None

portinha_aberta = False

camera = cv2.VideoCapture(0)

if camera.isOpened():
    print('camera conectada')
else:
    print('não foi possivel conectar com a camera')

with open('labels.txt', 'r') as f:
    labels = [line.strip() for line in f.readlines()]

while camera.isOpened():
    status, frame = camera.read()
    if not status:
        break

    # 1. Redimensiona o frame para 224x224
    imagem_pequena = cv2.resize(frame, (224, 224))
    
    # 2. Converte para RGB (padrão de cores que a IA aprendeu)
    imagem_rgb = cv2.cvtColor(imagem_pequena, cv2.COLOR_BGR2RGB)

    # 3. Formata como array Float32 com shape (1, 224, 224, 3)
    imagem_array = numpy.asarray(imagem_rgb, dtype=numpy.float32).reshape(1, 224, 224, 3)

    # 4. Normaliza entre -1 e 1
    imagem_normalizada = (imagem_array / 127.5) - 1.0

    # 5. Roda a predição no TFLite
    interpreter.set_tensor(input_details[0]['index'], imagem_normalizada)
    interpreter.invoke()
    predicao = interpreter.get_tensor(output_details[0]['index'])

    # 6. Identifica a classe
    classe_id = numpy.argmax(predicao)
    nome_classe = labels[classe_id]
    print(f"Detectado: {nome_classe}") 


    if classe_id == 0 :
        print('porta aberta')
    else:
        print('porta fechada')

    # 6. Identifica a classe
    classe_id = numpy.argmax(predicao)
    nome_classe = labels[classe_id]

    # --- LÓGICA DE DECISÃO E EXIBIÇÃO NA TELA ---
    if classe_id == 0:
        texto_status = "PORTA ABERTA"
        cor_status = (0, 255, 0) # Verde (no formato BGR)
    else:
        texto_status = "PORTA FECHADA"
        cor_status = (0, 0, 255) # Vermelho (no formato BGR)

    # DESENHA A CAIXA DE DIÁLOGO NA PARTE INFERIOR DO FRAME
    # 1. Cria um retângulo preto para fundo do texto
    cv2.rectangle(frame, (0, 420), (640, 480), (0, 0, 0), -1)

    # 2. Escreve o status da porta dentro do retângulo
    cv2.putText(frame, f"Status: {texto_status}", (20, 460), 
                cv2.FONT_HERSHEY_SIMPLEX, 1.0, cor_status, 2)

    # 3. Escreve quem foi detectado
    #cv2.putText(frame, f"Detectado: {nome_classe}", (300, 460), 
              #  cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

    # Exibe a câmera na tela
    cv2.imshow('camera', frame)



    # Exibe a câmera na tela
    cv2.imshow('camera', frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.release()
cv2.destroyAllWindows()