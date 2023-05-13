import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {CAT_API, API_KEY} from '@env';

const App = () => {
  const [currentIndex, setCurrentIndex] = useState<any>(null);
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getMeow();
  }, []);

  function getMeow() {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append('x-api-key', `${API_KEY}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${CAT_API}/images/search?limit=20&has_breeds=1`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setIsLoading(false);
        console.log(result);
        setResult(result);
      })
      .catch(error => console.log('error', error));
  }
  return (
    <SafeAreaView>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={result}
          onEndReached={() => getMeow()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={styles.articleContainer}
              key={index}
              onPress={() => {
                setCurrentIndex(index === currentIndex ? null : index);
              }}>
              <Image
                source={{uri: item.url}}
                style={index === currentIndex ? styles.fullSize : styles.catImg}
              />

              {index === currentIndex && (
                <View>
                  {item.breeds.map((item: any) => {
                    return (
                      <>
                        <View style={styles.flexWrapper} key={index}>
                          <Text style={styles.text}>Breed : {item.name}</Text>
                          <Text style={styles.text}>
                            Origin : {item.origin}
                          </Text>
                        </View>
                        <Text style={styles.text}> {item.description} </Text>
                      </>
                    );
                  })}
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  articleContainer: {
    width: '100%',
    // height: 200,
    marginBottom: 10,
    borderRadius: 7,
    elevation: 10,
    gap: 12,
    flexDirection: 'column',
    backgroundColor: '#FFFF',

    // paddingHorizontal: 18,
    paddingVertical: 15,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  fullSize: {
    width: '95%',
    height: 200,
    borderRadius: 5,
  },
  catImg: {
    width: '95%',
    height: 100,
    borderRadius: 5,
  },
  flexWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  text: {
    fontSize: 16,
    color: '#000',
  },
});
