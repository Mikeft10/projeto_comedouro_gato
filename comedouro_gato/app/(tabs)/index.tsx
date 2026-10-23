import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Estados dos Dados
  const [rationLevel, setRationLevel] = useState(75);
  const [isConnected, setIsConnected] = useState(true);
  
  // Controle do Formulário de Novo Pet
  const [isAddingPet, setIsAddingPet] = useState(false);
  
  // AGORA É UMA LISTA DE PETS (permite múltiplos cadastros)
  const [pets, setPets] = useState([
    { id: '1', name: 'Mingau', breed: 'SRD (Vira-lata)', age: '2 anos', weight: '4.5' },
  ]);

  // Estados temporários para o formulário de cadastro / edição
  const [editName, setEditName] = useState('');
  const [editBreed, setEditBreed] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editWeight, setEditWeight] = useState('');
  
  // Guarda o ID do pet que está sendo editado (null se for criação de um novo)
  const [editingPetId, setEditingPetId] = useState<string | null>(null);

  // Estados da Seção de Saúde
  const [newVaccineName, setNewVaccineName] = useState('');
  const [newVaccineDate, setNewVaccineDate] = useState('');
  const [vaccines, setVaccines] = useState([
    { id: '1', name: 'V5 (Múltipla)', date: '10/01/2026', status: 'Concluída' },
    { id: '2', name: 'Antirrábica', date: '15/09/2026', status: 'Pendente' },
  ]);

  const weightHistory = [
    { date: '27/07', weight: '4.3 kg' },
    { date: '10/08', weight: '4.4 kg' },
    { date: '26/08', weight: '4.5 kg (Atual)' },
  ];

  // Estados de Configurações
  const [isFeederActive, setIsFeederActive] = useState(true);
  const [wifiSSID, setWifiSSID] = useState('MinhaRede_5G');
  const [wifiPassword, setWifiPassword] = useState('');
  const [portionSize, setPortionSize] = useState('50');
  const [feedTime1, setFeedTime1] = useState('08:00');
  const [feedTime2, setFeedTime2] = useState('12:00');
  const [feedTime3, setFeedTime3] = useState('18:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  

  const handleFeedNow = () => {
    if (!isFeederActive) {
      Alert.alert('Atenção', 'O alimentador está desligado nas configurações.');
      return;
    }
    Alert.alert('Sucesso', 'Comando enviado! Liberando ração...');
  };

  const handleAddVaccine = () => {
    if (!newVaccineName || !newVaccineDate) {
      Alert.alert('Atenção', 'Preencha o nome e a data da vacina.');
      return;
    }
    const item = {
      id: String(Date.now()),
      name: newVaccineName,
      date: newVaccineDate,
      status: 'Agendada',
    };
    setVaccines([...vaccines, item]);
    setNewVaccineName('');
    setNewVaccineDate('');
    Alert.alert('Sucesso', 'Vacina registrada no calendário!');
  };

 const handleSaveSettings = () => {
    Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
    setActiveTab('home');
  };

  // Função para Salvar (Cria um novo ou atualiza o existente corretamente)
  const handleSavePet = () => {
    if (!editName.trim()) {
      Alert.alert('Atenção', 'O nome do pet não pode ficar em branco.');
      return;
    }

    if (editingPetId) {
      // Se tiver ID, estamos EDITANDO um pet existente
      setPets(pets.map(p => p.id === editingPetId ? {
        ...p,
        name: editName,
        breed: editBreed,
        age: editAge,
        weight: editWeight,
      } : p));
      Alert.alert('Sucesso', 'Pet atualizado com sucesso!');
    } else {
      // Se NÃO tiver ID, criamos um NOVO pet adicionando ao array
      const newPetObj = {
        id: String(Date.now()),
        name: editName,
        breed: editBreed,
        age: editAge,
        weight: editWeight,
      };
      setPets([...pets, newPetObj]);
      Alert.alert('Sucesso', 'Novo pet cadastrado!');
    }

    // Limpa os campos e fecha o formulário
    setIsAddingPet(false);
    setEditingPetId(null);
    setEditName('');
    setEditBreed('');
    setEditAge('');
    setEditWeight('');
  };

  // Prepara o formulário para editar um pet específico da lista
  const handleStartEdit = (item: { id: string; name: string; breed: string; age: string; weight: string }) => {
    setEditingPetId(item.id);
    setEditName(item.name);
    setEditBreed(item.breed);
    setEditAge(item.age);
    setEditWeight(item.weight);
    setIsAddingPet(true);
  };

  // Remove um pet da lista
  const handleDeletePet = (id: string) => {
    setPets(pets.filter(p => p.id !== id));
    Alert.alert('Removido', 'O pet foi removido da lista.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>CatBite 🐱</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: isConnected && isFeederActive ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.statusText}>
            {!isFeederActive ? 'Desligado' : isConnected ? 'Conectado' : 'Desconectado'}
          </Text>
        </View>
      </View>

      {/* Conteúdo Dinâmico das Abas */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ABA HOME */}
        {activeTab === 'home' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Próximas Refeições Programadas</Text>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleTime}>{feedTime1}</Text>
                <Text style={styles.scheduleLabel}>Manhã ({portionSize}g)</Text>
              </View>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleTime}>{feedTime2}</Text>
                <Text style={styles.scheduleLabel}>Tarde ({portionSize}g)</Text>
              </View>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleTime}>{feedTime3}</Text>
                <Text style={styles.scheduleLabel}>Noite ({portionSize}g)</Text>
              </View>
            </View>

            <View style={styles.feedContainer}>
              <TouchableOpacity
                style={[styles.feedButton, !isFeederActive && styles.feedButtonDisabled]}
                onPress={handleFeedNow}
                activeOpacity={0.8}
              >
                <Text style={styles.feedButtonText}>Alimentar Agora</Text>
                <Text style={styles.feedSubtext}>{isFeederActive ? 'Porção: ' + portionSize + 'g' : 'Dispositivo Desligado'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.card, styles.statCard]}>
                <Text style={styles.cardTitle}>Nível da Ração</Text>
                <Text style={styles.statValue}>{rationLevel}%</Text>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${rationLevel}%` }]} />
                </View>
              </View>

              <View style={[styles.card, styles.statCard]}>
                <Text style={styles.cardTitle}>Última Refeição</Text>
                <Text style={styles.statValue}>{feedTime2}</Text>
                <Text style={styles.statSubtext}>Hoje</Text>
              </View>
            </View>
          </>
        )}

        {/* ABA PETS */}
        {activeTab === 'pets' && (
          <View>
            {/* Botão de Adicionar Novo Pet (só aparece se o formulário estiver fechado) */}
            {!isAddingPet && (
              <TouchableOpacity 
                style={styles.addNewPetMainButton}
                onPress={() => {
                  setEditingPetId(null);
                  setEditName('');
                  setEditBreed('');
                  setEditAge('');
                  setEditWeight('');
                  setIsAddingPet(true);
                }}
              >
                <Text style={styles.addNewPetMainButtonText}>+ Adicionar Novo Pet</Text>
              </TouchableOpacity>
            )}

            {/* Formulário de Cadastro / Edição de Pet */}
            {isAddingPet && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  {editingPetId ? 'Editar Perfil do Pet' : 'Cadastrar Novo Pet'}
                </Text>
                
                <Text style={styles.inputLabel}>Nome do Pet</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: Pelúcio" 
                  value={editName} 
                  onChangeText={setEditName} 
                />
                
                <Text style={styles.inputLabel}>Raça</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: Persa" 
                  value={editBreed} 
                  onChangeText={setEditBreed} 
                />

                <Text style={styles.inputLabel}>Idade</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: 1 ano" 
                  value={editAge} 
                  onChangeText={setEditAge} 
                />

                <Text style={styles.inputLabel}>Peso (kg)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: 4.5" 
                  keyboardType="numeric"
                  value={editWeight} 
                  onChangeText={setEditWeight} 
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <TouchableOpacity 
                    style={[styles.editButton, { backgroundColor: '#2E7D32', flex: 0.48 }]} 
                    onPress={handleSavePet}
                  >
                    <Text style={styles.editButtonText}>Salvar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.deleteButton, { flex: 0.48 }]} 
                    onPress={() => {
                      setIsAddingPet(false);
                      setEditingPetId(null);
                    }}
                  >
                    <Text style={styles.deleteButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={styles.cardTitle}>Meus Pets Cadastrados</Text>
            
            {/* Lista todos os pets cadastrados */}
            {pets.length > 0 ? (
              pets.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.petHeaderRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>🐱</Text>
                    </View>
                    <View style={styles.petMainInfo}>
                      <Text style={styles.petName}>{item.name}</Text>
                      <Text style={styles.petBreed}>{item.breed}</Text>
                    </View>
                  </View>

                  <View style={styles.petDetailsRow}>
                    <View style={styles.petDetailItem}>
                      <Text style={styles.detailLabel}>Idade</Text>
                      <Text style={styles.detailValue}>{item.age}</Text>
                    </View>
                    <View style={styles.petDetailItem}>
                      <Text style={styles.detailLabel}>Peso</Text>
                      <Text style={styles.detailValue}>{item.weight} kg</Text>
                    </View>
                  </View>

                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleStartEdit(item)}
                    >
                      <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeletePet(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={[styles.card, styles.noPetContainer]}>
                <Text style={styles.noPetText}>Nenhum pet cadastrado no momento.</Text>
              </View>
            )}
          </View>
        )}

        {/* ABA SAÚDE */}
        {activeTab === 'health' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Histórico de Peso (Últimos 30 Dias)</Text>
              {weightHistory.map((item, index) => (
                <View key={index} style={styles.weightRow}>
                  <Text style={styles.weightDate}>{item.date}</Text>
                  <Text style={styles.weightVal}>{item.weight}</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Calendário de Vacinação</Text>
              
              <View style={styles.addVaccineForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Nome da Vacina (ex: V5)"
                  value={newVaccineName}
                  onChangeText={setNewVaccineName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Data (ex: 15/10/2026)"
                  value={newVaccineDate}
                  onChangeText={setNewVaccineDate}
                />
                <TouchableOpacity style={styles.addVaccineButton} onPress={handleAddVaccine}>
                  <Text style={styles.addVaccineButtonText}>+ Adicionar Vacina</Text>
                </TouchableOpacity>
              </View>

              {vaccines.map((v) => (
                <View key={v.id} style={styles.vaccineRow}>
                  <View>
                    <Text style={styles.vaccineName}>{v.name}</Text>
                    <Text style={styles.vaccineDate}>Data: {v.date}</Text>
                  </View>
                  <View style={[styles.badge, v.status === 'Concluída' ? styles.badgeSuccess : styles.badgeWarning]}>
                    <Text style={styles.badgeText}>{v.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ABA EXPLORE */}
        {activeTab === 'explore' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Explore</Text>
            <Text style={styles.exploreText}>
              Dicas de cuidados, nutrição e artigos para a saúde do seu gato.
            </Text>
          </View>
        )}

        {/* ABA CONFIGURAÇÕES */}
        {activeTab === 'settings' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Energia e Estado</Text>
              <View style={styles.settingSwitchRow}>
                <View>
                  <Text style={styles.settingLabel}>Alimentador Ligado</Text>
                  <Text style={styles.settingSubtext}>Ativa/desativa comandos automáticos</Text>
                </View>
                <Switch
                  value={isFeederActive}
                  onValueChange={setIsFeederActive}
                  trackColor={{ false: '#CBD5E1', true: '#00A896' }}
                />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Horários e Porção</Text>
              
              <Text style={styles.inputLabel}>Tamanho da Porção (gramas)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={portionSize}
                onChangeText={setPortionSize}
              />

              <Text style={styles.inputLabel}>Horário Refeição 1</Text>
              <TextInput style={styles.input} value={feedTime1} onChangeText={setFeedTime1} />

              <Text style={styles.inputLabel}>Horário Refeição 2</Text>
              <TextInput style={styles.input} value={feedTime2} onChangeText={setFeedTime2} />

              <Text style={styles.inputLabel}>Horário Refeição 3</Text>
              <TextInput style={styles.input} value={feedTime3} onChangeText={setFeedTime3} />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Conexão Wi-Fi do Dispositivo</Text>
              
              <View style={styles.settingSwitchRow}>
                <Text style={styles.settingLabel}>Status da Conexão</Text>
                <Switch
                  value={isConnected}
                  onValueChange={setIsConnected}
                  trackColor={{ false: '#CBD5E1', true: '#4CAF50' }}
                />
              </View>

              <Text style={styles.inputLabel}>Nome da Rede (SSID)</Text>
              <TextInput style={styles.input} value={wifiSSID} onChangeText={setWifiSSID} />

              <Text style={styles.inputLabel}>Senha do Wi-Fi</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="••••••••"
                value={wifiPassword}
                onChangeText={setWifiPassword}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Alertas do Sistema</Text>
              <View style={styles.settingSwitchRow}>
                <View>
                  <Text style={styles.settingLabel}>Aviso de Ração Baixa</Text>
                  <Text style={styles.settingSubtext}>Notificar quando estiver abaixo de 20%</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#CBD5E1', true: '#00A896' }}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveSettingsButton} onPress={handleSaveSettings}>
              <Text style={styles.saveSettingsButtonText}>Salvar Configurações</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Barra Preta Inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <Text style={[styles.navIcon, activeTab === 'home' && styles.navTextActive]}>🏠</Text>
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('pets')}>
          <Text style={[styles.navIcon, activeTab === 'pets' && styles.navTextActive]}>🐾</Text>
          <Text style={[styles.navText, activeTab === 'pets' && styles.navTextActive]}>Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('health')}>
          <Text style={[styles.navIcon, activeTab === 'health' && styles.navTextActive]}>🏥</Text>
          <Text style={[styles.navText, activeTab === 'health' && styles.navTextActive]}>Saúde</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('explore')}>
          <Text style={[styles.navIcon, activeTab === 'explore' && styles.navTextActive]}>🧭</Text>
          <Text style={[styles.navText, activeTab === 'explore' && styles.navTextActive]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('settings')}>
          <Text style={[styles.navIcon, activeTab === 'settings' && styles.navTextActive]}>⚙️</Text>
          <Text style={[styles.navText, activeTab === 'settings' && styles.navTextActive]}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 12,
  },
  addNewPetMainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  addNewPetMainButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  petHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  petMainInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  petBreed: {
    fontSize: 14,
    color: '#95A5A6',
  },
  petDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  petDetailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#95A5A6',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495E',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 0.48,
    backgroundColor: '#00A896',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    flex: 0.48,
    backgroundColor: '#FFEBEE',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontWeight: '600',
    fontSize: 14,
  },
  noPetContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  noPetText: {
    color: '#95A5A6',
    marginBottom: 10,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  weightDate: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  weightVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  addVaccineForm: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 8,
  },
  addVaccineButton: {
    backgroundColor: '#00A896',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  addVaccineButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  vaccineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  vaccineName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  vaccineDate: {
    fontSize: 12,
    color: '#95A5A6',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSuccess: {
    backgroundColor: '#E8F5E9',
  },
  badgeWarning: {
    backgroundColor: '#FFF3E0',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  exploreText: {
    color: '#7F8C8D',
    textAlign: 'center',
    marginVertical: 20,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495E',
  },
  scheduleLabel: {
    fontSize: 14,
    color: '#95A5A6',
  },
  feedContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  feedButton: {
    backgroundColor: '#00A896',
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#00A896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  feedButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowColor: '#94A3B8',
  },
  feedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedSubtext: {
    color: '#E0F2F1',
    fontSize: 12,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statCard: {
    flex: 0.48,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginVertical: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#95A5A6',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00A896',
    borderRadius: 4,
  },
  settingSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  settingSubtext: {
    fontSize: 12,
    color: '#95A5A6',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 6,
    marginBottom: 4,
  },
  saveSettingsButton: {
    backgroundColor: '#028090',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveSettingsButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    color: '#94A3B8',
  },
  navText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  navTextActive: {
    color: '#00A896',
    fontWeight: 'bold',
  },
});
