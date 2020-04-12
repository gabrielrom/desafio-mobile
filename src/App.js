import React, { useState, useEffect } from "react";

import api from './services/api';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`);

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    const repository = response.data;
    repositories[repositoryIndex].likes = repository.likes;

    setRepositories([...repositories])

  }

  async function handleAddRepository(){
    const response = await api.post('/repositories', {
      title: `Novo repositorio ${Date.now()}`,
      url: 'https://github.com/gabrielrom/desafio-conceitos-node',
      techs: 'React Native, NodeJS, Express'
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id){
    await api.delete(`/repositories/${id}`);

    const repositoryIndex = repositories.findIndex(repository => repository.id === id); 
    repositories.splice(repositoryIndex, 1);

    setRepositories([...repositories]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          ListEmptyComponent={(
            <>
              <Icon
                name="rocket1"
                size={90}
                color="#FFF"
                style={styles.iconEmpty}
              />
              <View style={styles.listEmpty}>
                <Text style={styles.emptyText}>A sua lista de repositórios está vazia</Text>
              </View>
            </>
          )}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>

              <View style={styles.headerDelete}>
                <Text style={styles.repository}>{repository.title}</Text>
                <Icon 
                  name="delete" 
                  size={25} 
                  color="#900" 
                  onPress={() => handleRemoveRepository(repository.id)}
                />
              </View>
              
              <View style={styles.techsContainer}>
                {repository.techs.map(tech => (
                  <Text style={styles.tech} key={tech}>
                    {tech}
                  </Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                activeOpacity={0.9}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )
        }
        />
        <TouchableOpacity 
          activeOpacity={0.6} 
          style={styles.buttonAdd}
          onPress={handleAddRepository}
        >
          <Text style={styles.buttonAddText}>Adicionar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  buttonAdd: {
    backgroundColor: '#FFF',
    margin: 20,
    height: 50,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonAddText: {
    color: '#7159c1',
    fontSize: 20,
    fontWeight: 'bold'
  },

  headerDelete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 20
  },

  listEmpty:{
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },

  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  iconEmpty: {
    alignSelf: 'center',
    marginTop: 260,
    
  }

});
