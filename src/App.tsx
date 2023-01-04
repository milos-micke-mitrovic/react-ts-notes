import { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";
import NewNote from "./NewNote";
import EditNote from "./EditNote";
import { useLocalStorage } from "./hooks/useLocalStorage";
import NoteList from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import Note from "./Note";

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

  const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes((prevNotes: RawNote[]) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  };

  const onDeleteNote = (id: string) => {
    setNotes((prevNotes: RawNote[]) =>
      prevNotes.filter((note) => note.id !== id)
    );
  };

  const addTag = (tag: Tag) => {
    setTags((prev: []) => [...prev, tag]);
  };

  const updateTag = (id: string, label: string) => {
    setTags((prevTags: Tag[]) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  };

  const deleteTag = (id: string) => {
    setTags((prevTags: Tag[]) => prevTags.filter((tag) => tag.id !== id));
  };

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <h1>
              <NoteList
                avaliableTags={tags}
                notes={notesWithTags}
                onUpdateTag={updateTag}
                onDeleteTag={deleteTag}
              />
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

        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                avaliableTags={tags}
              />
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
};

export default App;
