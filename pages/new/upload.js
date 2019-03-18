import React, {useState, useEffect} from 'react'
import NextLink from 'next/link'
import Router from 'next/router'
import {Pane, Alert, Heading, Paragraph, Button, Link} from 'evergreen-ui'
import {validate, extractAsTree} from '@etalab/bal'

// import {createBal} from '../../lib/storage'
import Uploader from '../../components/uploader'

function getFileExtension(name) {
  const pos = name.lastIndexOf('.')
  if (pos > 0) {
    return name.substr(pos + 1)
  }

  return null
}

function Index() {
  const [file, setFile] = useState(null)
  const [report, setReport] = useState(null)
  const [tree, setTree] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onError = error => {
    setFile(null)
    setTree(null)
    setLoading(false)
    setError(error)
  }

  const onDrop = ([file]) => {
    setLoading(true)
    setReport(null)
    setTree(null)

    if (getFileExtension(file.name) !== 'csv') {
      return onError('Ce type de fichier n’est pas supporté. Vous devez déposer un fichier CSV.')
    }

    if (file.size > 100 * 1024 * 1024) {
      return onError('Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 100 Mo.')
    }

    setFile(file)
    setError(null)
  }

  const parseFile = async () => {
    try {
      const report = await validate(file)
      if (report) {
        if (!report.isValid) {
          setReport(report)
        }

        const tree = extractAsTree(report.normalizedRows, false)
        setTree(tree)
      } else {
        onError('Le fichier n’est pas conforme.')
      }
    } catch (error) {
      return onError(`Impossible d’analyser le fichier… [${error.message}]`)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (file) {
      parseFile()
    }
  }, [file])

  const onEdit = () => {
    // const id = createBal(tree)
    // Router.push(`/bal?balId=${id}`, `/bal/${id}`)
  }

  return (
    <Pane display='flex' flex={1} flexDirection='column' overflowY='scroll'>
      <Pane paddingX={16} paddingBottom={16}>
        <Heading size={600} margin='default'>Modifier une Base Adresse Locale existante</Heading>
        <Paragraph margin='default'>
          Pour être éditable à l’aide de cet outil, votre fichier doit être conforme au modèle BAL 1.1 de l’AITF.
        </Paragraph>
        <Uploader
          file={file}
          height={150}
          placeholder='Sélectionnez ou glissez ici votre fichier BAL au format CSV (maximum 100 Mo)'
          loading={loading}
          loadingLabel='Analyse en cours'
          onDrop={onDrop}
        />
        {error && (
          <Alert
            intent='danger'
            title={error}
            marginTop={10}
          />
        )}
        {report && (
          <Alert
            intent='warning'
            title='Le fichier contient des erreurs de validation :'
            marginTop={10}
          >
            TODO
          </Alert>
        )}
        {tree && (
          <Alert
            intent='success'
            title='Le fichier sélectionné est conforme !'
            marginTop={10}
          >
            <Button height={40} marginTop={10} appearance='primary' intent='success' onClick={onEdit}>
              Modifier la Base Adresse Locale
            </Button>
          </Alert>
        )}
      </Pane>

      <Pane borderTop marginTop='auto' padding={16} paddingTop={8}>
        <NextLink href='/new/ban'>
          <Link href='/new/ban' display='block' marginY={6}>
            Créer une Base Adresse Locale à partir de la BAN
          </Link>
        </NextLink>
        <NextLink href='/new/empty'>
          <Link href='/new/empty' display='block' marginY={6}>
            Créer une Base Adresse Locale vide
          </Link>
        </NextLink>
      </Pane>
    </Pane>
  )
}

Index.getInitialProps = () => ({
  layout: 'fullscreen'
})

export default Index
