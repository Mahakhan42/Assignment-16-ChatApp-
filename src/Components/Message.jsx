import React, { useState } from 'react'
import { HStack, Avatar, Text, IconButton } from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const Message = ({ id, text, url, user = "other", onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedText, setUpdatedText] = useState(text);

  const handleUpdate = () => {
    onUpdate(id, updatedText);
    setIsEditing(false);
  }

  return (
    <HStack alignSelf={user === 'me' ? 'flex-end' : 'flex-start'} bg='gray.100' paddingY={'2'} paddingX={user === 'me' ? '4' : '2'} borderRadius={'base'}>
      {user === 'other' && <Avatar src={url} />}
      {isEditing ? (
        <>
          <input type="text" value={updatedText} onChange={(e) => setUpdatedText(e.target.value)} />
          <IconButton icon={<EditIcon />} onClick={handleUpdate} />
        </>
      ) : (
        <>
          <Text>{text}</Text>
          {user === 'me' && (
            <>
              <IconButton icon={<EditIcon />} onClick={() => setIsEditing(true)} />
              <IconButton icon={<DeleteIcon />} onClick={() => onDelete(id)} />
            </>
          )}
        </>
      )}
      {user === 'me' && <Avatar src={url} />}
    </HStack>
  )
}

export default Message

