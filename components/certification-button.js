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
      <div>
        <Button
          isLoading={isLoading}
          type='submit'
          appearance='primary'
          intent='success'
          iconAfter={EndorsedIcon}
          onClick={() => onConfirm(isCertified ? null : true)}
        >
          {submitCertificationLabel}
        </Button>
      </div>

      <div>
        <Button
          isLoading={isLoading}
          type='submit'
          appearance='default'
          intent={isCertified ? 'danger' : 'success'}
          onClick={() => onConfirm(isCertified ? false : null)}
        >
          {submitLabel}
        </Button>
      </div>

      <div>
        <Button
          disabled={isLoading}
          appearance='default'
          display='inline-flex'
          onClick={onCancel}
        >
          Annuler
        </Button>
      </div>

      <style jsx>{`
        .certification-button-wrapper {
          position: sticky;
          bottom: 0;
          display: flex;
          padding: 10px;
          align-items: center;
          justify-content: center;
        }

        .certification-button-wrapper > div {
          box-shadow: 0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47);
          margin-left: 8px;
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
