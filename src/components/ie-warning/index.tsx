import styles from "./ie-warning.module.css";

function IEWarning() {
  return (
    <div className={styles["ie-warning"]}>
      <p>
        Votre navigateur <b>Internet Explorer</b> n‘est plus supporté par notre
        service.
      </p>
      <p>
        <b>Nous vous recommandons d‘utiliser un autre navigateur</b>
      </p>
    </div>
  );
}

export default IEWarning;
