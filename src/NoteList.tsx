import { useMemo, useState } from "react";
import { Badge, Button, Card, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";

import { Tag } from "./App";
import styles from "./NoteList.module.css";

type SimplifiedNote = {
  id: string;
  title: string;
  tags: Tag[];
};

type NoteListProp = {
  avaliableTags: Tag[];
  notes: SimplifiedNote[];
};

const NoteList = ({ avaliableTags, notes }: NoteListProp) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");

  const filteredNotes = useMemo(
    () =>
      notes.filter((note) => {
        return (
          title === "" ||
          (note.title.toLowerCase().includes(title.toLowerCase()) &&
            (selectedTags.length === 0 ||
              selectedTags.every((tag) =>
                note.tags.some((noteTag) => noteTag.id === tag.id)
              )))
        );
      }),
    [title, selectedTags, notes]
  );

  return (
    <>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Notes</h1>
        </Col>

        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new" className="d-flex">
              <Button>Create</Button>
            </Link>

            <Button variant="outline-secondary">Edit tags</Button>
          </Stack>
        </Col>
      </Row>

      <Form>
        <Row className="mb-4 h6">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>

              <ReactSelect
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={avaliableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
    </>
  );
};

const NoteCard = ({ id, title, tags }: SimplifiedNote) => {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap h6"
            >
              {tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default NoteList;
