interface PersonProps {
  name: string;
  age: number;
}

export function Person({ name, age }: PersonProps) {
  return (
    <div>
      <div>Name: {name}</div>
      <div>Age: {age}</div>
    </div>
  );
}
