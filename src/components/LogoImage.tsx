import styled from "@emotion/styled";
import logo from 'assets/poli.png'

export const LogoImage = styled.img({
  display: 'block',
  margin: '15px auto',
  width: 150,
  height: 'auto'
});

LogoImage.defaultProps = {
  src: logo,
  alt: "Logo polimdo"
}
