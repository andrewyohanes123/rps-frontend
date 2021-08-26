import styled from "@emotion/styled";


interface props {
  widthLimit?: number;
  padding?: number;
}

const {innerHeight} = window;

export const Container = styled.div<props>(({widthLimit, padding}) => ({
  padding: padding ?? 10,
  maxWidth: widthLimit,
  margin: '0 auto'
}))

export const HomeContainer = styled.div({
  padding: 12,
  maxWidth: 800,
  margin: '0 auto',
  paddingTop: Math.round(innerHeight / 5)
})