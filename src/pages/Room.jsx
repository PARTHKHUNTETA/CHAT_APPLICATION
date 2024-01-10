import React from "react";
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from "../appwriteConfig";
import { ID, Query, Role, Permission } from "appwrite";
import { useState, useEffect } from "react";
import { Trash2 } from "react-feather";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getMessages();
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        // Callback will be executed on changes for documents A and all files.
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("MESSAGE WAS CREATED !!!");
          setMessages((prevState) => [response.payload, ...prevState]);
        }
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("MESSAGE WAS DELETED !!!");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      body: messageBody,
      user_id: user.$id,
      username: user.name,
    };
    let permissions = [Permission.write(Role.user(user.$id))];
    try {
      let response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        ID.unique(),
        payload,
        permissions
      );
      console.log(response);
      setMessageBody("");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      const response = await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        id
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getMessages = async () => {
    const data = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderDesc("$createdAt")]
    );
    setMessages(data.documents);
  };

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form id="message--form" onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              placeholder="say something..."
              maxLength="1000"
              onChange={(e) => setMessageBody(e.target.value)}
              value={messageBody}
            ></textarea>
          </div>
          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="Send" />
          </div>
        </form>
        <div>
          {messages.map((message) => (
            <div className="message--wrapper" key={message.$id}>
              <div className="message--header">
                <p>
                  {message?.username ? (
                    <span>{message.username}</span>
                  ) : (
                    <span>Anonymous</span>
                  )}{" "}
                  <small className="message-timestamp">
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                </p>
                {message?.$permissions?.includes(
                  `delete(\"user:${user.$id}\")`
                ) && (
                  <Trash2
                    className="delete--btn"
                    onClick={() => {
                      deleteMessage(message.$id);
                    }}
                  >
                    X
                  </Trash2>
                )}
              </div>
              <div className="message--body">
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Room;
