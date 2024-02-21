import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Container, HStack, Input, VStack } from '@chakra-ui/react'
import Message from './Components/Message'
import { onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { app } from './Firebase'
import { getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'


const auth = getAuth(app);
const db = getFirestore(app);

const LoginHandle = () => {
  const Googleprovider = new GoogleAuthProvider();
  signInWithPopup(auth, Googleprovider)
}

const LogoutHandle = () => signOut(auth);

const App = () => {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divforscroll = useRef(null);

  const SubmitHandle = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        url: user.photoURL,
        createdAt: serverTimestamp()
      });
      setMessage("");
      divforscroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const updateMessage = async (id, updatedText) => {
    try {
      await updateDoc(doc(db, 'Messages', id), {
        text: updatedText,
      });
    } catch (error) {
      console.error('Error updating message:', error);
    }
  }

  const deleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, 'Messages', id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
    const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((item) => {
        const id = item.id;
        return { id, ...item.data() };
      }));
    });

    return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
  }, []);

  return (
    <>
      <Box bgGradient="linear(to-b, #7928CA, #FF0080).20">
        {user ? (
          <Container h={"100vh"} bg={"plum"}>
            <VStack h='full' padding={"4"}>
              <Button colorScheme={'red'} w={"full"} onClick={LogoutHandle}>Logout</Button>
              <VStack h='full' w={'full'} overflowY='auto' css={{"&::-webkit-scrollbar":{display:'none'}}}>
                {messages.map(item => (
                  <Message
                    key={item.id}
                    id={item.id}
                    user={item.uid === user.uid ? 'me' : 'other'}
                    text={item.text}
                    url={item.url}
                    onUpdate={updateMessage}
                    onDelete={deleteMessage}
                  />
                ))}
                <div ref={divforscroll}></div>
              </VStack>
              <form value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: "100%" }} onSubmit={SubmitHandle}>
                <HStack>
                  <Input type="text" value={message} onChange={handleChange} placeholder="Type your message..." />
                  <Button colorScheme='purple' type='submit'>Send</Button>
                </HStack>
              </form>
            </VStack>
          </Container>
        ) : (
          <VStack h='100vh' justifyContent={'center'}>
            <Button colorScheme='purple' onClick={LoginHandle}>Sign In With Google</Button>
          </VStack>
        )}
      </Box>
    </>
  )
}

export default App



