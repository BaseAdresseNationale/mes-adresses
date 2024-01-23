import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {Button, EndorsedIcon} from 'evergreen-ui'

function CertificationButton({isLoading, onConfirm, onCancel, isCertified}) {
  const submitCertificationLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return isCertified ? 'Enregistrer' : 'Certifier et enregistrer'
  }, [isLoading, isCertified])

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return isCertified ? 'Ne plus certifier et enregistrer' : 'Enregistrer'
  }, [isLoading, isCertified])

  return (
    <div className="certification-button-wrapper">
      <Button
        isLoading={isLoading}
        type='submit'
        appearance='primary'
        intent='success'
        marginTop={16}
        marginLeft={8}
        iconAfter={EndorsedIcon}
        onClick={() => onConfirm(isCertified ? null : true)}
      >
        {submitCertificationLabel}
      </Button>

      <Button
        isLoading={isLoading}
        type='submit'
        appearance='default'
        intent={isCertified ? 'danger' : 'success'}
        marginTop={16}
        marginLeft={8}
        onClick={() => onConfirm(isCertified ? false : null)}
      >
        {submitLabel}
      </Button>

      <Button
        disabled={isLoading}
        appearance='default'
        marginLeft={8}
        marginTop={16}
        display='inline-flex'
        onClick={onCancel}
      >
        Annuler
      </Button>

      <style jsx>{`
        .certification-button-wrapper {
          position: sticky;
          bottom: 0;
          display: flex;
        }
      `}</style>
    </div>
  )
}

CertificationButton.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isCertified: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default CertificationButton
