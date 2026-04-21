const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic'
  }

  return (
    <div style={footerStyle}>
      <br />
      <img
        src="/ebrar.jpg"
        alt="Ebrar"
        style={{ width: '180px', borderRadius: '12px', display: 'block' }}
      />
      <p>
        I love EBRARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
      </p>
    </div>
  )
}

export default Footer
