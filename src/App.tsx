import { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";
import NewNote from "./NewNote";
import { useLocalStorage } from "./hooks/useLocalStorage";
import NoteList from "./NoteList";

export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

const App = () => {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(
    () =>
      notes.map((note) => {
        return {
          ...note,
          tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
        };
      }),
    [notes, tags]
  );

  const onCreateNotes = ({ tags, ...data }: NoteData) => {
    setNotes((prevNotes: []) => {
      return [
        ...prevNotes,
        { ...data, id: uuidv4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  };

  const addTag = (tag: Tag) => {
    setTags((prev: []) => [...prev, tag]);
  };

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <h1>
              <NoteList avaliableTags={tags} notes={notesWithTags} />
            </h1>
          }
        />

        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNotes}
              onAddTag={addTag}
              avaliableTags={tags}
            />
          }
        />

        <Route path="/:id">
          <Route index element={<h1>Show</h1>} />
          <Route path="edit" element={<h1>Edit</h1>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
};

export default App;
