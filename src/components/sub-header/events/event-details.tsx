"use client";

import { Pane, Text } from "evergreen-ui";

import {
  Event,
  SerializedNumero,
  SerializedToponyme,
  SerializedVoie,
} from "@/lib/openapi-api-bal";
import {
  NUMERO_FIELDS,
  TOPONYME_FIELDS,
  VOIE_FIELDS,
  formatNumeroCount,
  getChangedFields,
  getFieldDisplayValue,
  getFilledFields,
  getNumeroIdsDiff,
  getNumeroLabel,
  isVoieGeometryChanged,
} from "@/lib/events/event-details";

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <Pane display="flex" justifyContent="space-between" gap={12} paddingY={3}>
      <Text size={300} color="muted" flexShrink={0}>
        {label}
      </Text>
      <Text size={300} textAlign="right">
        {children}
      </Text>
    </Pane>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text
      size={300}
      fontWeight={600}
      marginTop={8}
      marginBottom={4}
      display="block"
    >
      {children}
    </Text>
  );
}

function NumeroCountLine({
  count,
  adjective,
  sign,
}: {
  count: number;
  adjective: string;
  sign: "+" | "-";
}) {
  const plural = count > 1 ? "s" : "";

  return (
    <SectionTitle>
      {sign}
      {count} numéro{plural} {adjective}
      {plural}
    </SectionTitle>
  );
}

function NumeroList({ numeros }: { numeros: SerializedNumero[] }) {
  return (
    <Pane>
      {numeros.map((numero) => (
        <Text key={numero.id} size={300} display="block">
          • {getNumeroLabel(numero)}
          {numero.certifie ? " — certifié" : ""}
        </Text>
      ))}
    </Pane>
  );
}

function getChildrenOfType(
  event: Event,
  entityType: Event.entityType,
  action: Event.action
): Event[] {
  return (event.childEvents ?? []).filter(
    (child) => child.entityType === entityType && child.action === action
  );
}

function getNumeroDetails(event: Event): React.ReactNode | null {
  if (event.action === Event.action.DELETE) {
    return null;
  }

  if (event.action === Event.action.CREATE) {
    const after = event.payloadAfter as SerializedNumero;
    const filledFields = getFilledFields(after, NUMERO_FIELDS);

    if (filledFields.length === 0) {
      return null;
    }

    return (
      <>
        {filledFields.map((field) => (
          <DetailRow key={String(field.key)} label={field.label}>
            {getFieldDisplayValue(field, after?.[field.key])}
          </DetailRow>
        ))}
      </>
    );
  }

  // UPDATE
  const before = event.payloadBefore as SerializedNumero;
  const after = event.payloadAfter as SerializedNumero;
  const changedFields = getChangedFields(before, after, NUMERO_FIELDS);

  if (changedFields.length === 0) {
    return null;
  }

  return (
    <>
      {changedFields.map((field) => (
        <DetailRow key={String(field.key)} label={field.label}>
          {getFieldDisplayValue(field, before?.[field.key])} →{" "}
          {getFieldDisplayValue(field, after?.[field.key])}
        </DetailRow>
      ))}
    </>
  );
}

function getVoieDetails(event: Event): React.ReactNode | null {
  if (event.action === Event.action.CREATE) {
    const after = event.payloadAfter as SerializedVoie;
    const filledFields = getFilledFields(after, VOIE_FIELDS);
    const createdNumeroEvents = getChildrenOfType(
      event,
      Event.entityType.NUMERO,
      Event.action.CREATE
    );
    const createdNumeros = createdNumeroEvents.map(
      (child) => child.payloadAfter as SerializedNumero
    );

    if (filledFields.length === 0 && createdNumeros.length === 0) {
      return null;
    }

    return (
      <>
        {filledFields.map((field) => (
          <DetailRow key={String(field.key)} label={field.label}>
            {getFieldDisplayValue(field, after?.[field.key])}
          </DetailRow>
        ))}

        {createdNumeros.length > 0 && (
          <>
            <SectionTitle>
              {formatNumeroCount(createdNumeros.length, "créé")}
            </SectionTitle>
            <NumeroList numeros={createdNumeros} />
          </>
        )}
      </>
    );
  }

  if (event.action === Event.action.DELETE) {
    const deletedNumeroEvents = getChildrenOfType(
      event,
      Event.entityType.NUMERO,
      Event.action.DELETE
    );
    const deletedNumeros = deletedNumeroEvents.map(
      (child) => child.payloadBefore as SerializedNumero
    );

    if (deletedNumeros.length === 0) {
      return (
        <Text size={300} color="muted">
          Aucun numéro supprimé
        </Text>
      );
    }

    return (
      <>
        <SectionTitle>
          {formatNumeroCount(deletedNumeros.length, "supprimé")}
        </SectionTitle>
        <NumeroList numeros={deletedNumeros} />
      </>
    );
  }

  // UPDATE
  const before = event.payloadBefore as SerializedVoie;
  const after = event.payloadAfter as SerializedVoie;
  const changedFields = getChangedFields(before, after, VOIE_FIELDS);
  const geometryChanged = isVoieGeometryChanged(before, after);

  if (changedFields.length === 0 && !geometryChanged) {
    return null;
  }

  return (
    <>
      {changedFields.map((field) => (
        <DetailRow key={String(field.key)} label={field.label}>
          {getFieldDisplayValue(field, before?.[field.key])} →{" "}
          {getFieldDisplayValue(field, after?.[field.key])}
        </DetailRow>
      ))}
      {geometryChanged && <DetailRow label="Tracé">Modifié</DetailRow>}
    </>
  );
}

function getToponymeDetails(event: Event): React.ReactNode | null {
  if (event.action === Event.action.CREATE) {
    const after = event.payloadAfter as SerializedToponyme;
    const filledFields = getFilledFields(after, TOPONYME_FIELDS);
    const numeroIds = after?.numeroIds ?? [];

    if (filledFields.length === 0 && numeroIds.length === 0) {
      return null;
    }

    return (
      <>
        {filledFields.map((field) => (
          <DetailRow key={String(field.key)} label={field.label}>
            {getFieldDisplayValue(field, after?.[field.key])}
          </DetailRow>
        ))}
        {numeroIds.length > 0 && (
          <NumeroCountLine
            count={numeroIds.length}
            adjective="rattaché"
            sign="+"
          />
        )}
      </>
    );
  }

  if (event.action === Event.action.DELETE) {
    const before = event.payloadBefore as SerializedToponyme;
    const filledFields = getFilledFields(before, TOPONYME_FIELDS).filter(
      (field) => field.key !== "nom"
    );
    const numeroIds = before?.numeroIds ?? [];

    if (filledFields.length === 0 && numeroIds.length === 0) {
      return null;
    }

    return (
      <>
        {filledFields.map((field) => (
          <DetailRow key={String(field.key)} label={field.label}>
            {getFieldDisplayValue(field, before?.[field.key])}
          </DetailRow>
        ))}
        {numeroIds.length > 0 && (
          <NumeroCountLine
            count={numeroIds.length}
            adjective="détaché"
            sign="-"
          />
        )}
      </>
    );
  }

  // UPDATE
  const before = event.payloadBefore as SerializedToponyme;
  const after = event.payloadAfter as SerializedToponyme;
  const changedFields = getChangedFields(before, after, TOPONYME_FIELDS);
  const { added, removed } = getNumeroIdsDiff(
    before?.numeroIds,
    after?.numeroIds
  );

  if (changedFields.length === 0 && added === 0 && removed === 0) {
    return null;
  }

  return (
    <>
      {changedFields.map((field) => (
        <DetailRow key={String(field.key)} label={field.label}>
          {getFieldDisplayValue(field, before?.[field.key])} →{" "}
          {getFieldDisplayValue(field, after?.[field.key])}
        </DetailRow>
      ))}
      {added > 0 && (
        <NumeroCountLine count={added} adjective="rattaché" sign="+" />
      )}
      {removed > 0 && (
        <NumeroCountLine count={removed} adjective="détaché" sign="-" />
      )}
    </>
  );
}

export function getEventDetails(event: Event): React.ReactNode | null {
  switch (event.entityType) {
    case Event.entityType.NUMERO:
      return getNumeroDetails(event);
    case Event.entityType.VOIE:
      return getVoieDetails(event);
    case Event.entityType.TOPONYME:
      return getToponymeDetails(event);
    default:
      return null;
  }
}
