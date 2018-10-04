package it.donpablo.fantagenio;

/**
 * Created by SERVILL7 on 23/07/2018.
 */
import java.util.LinkedList;

public class Stack {
	private LinkedList<Object> list = new LinkedList<Object>();

	public void push(Object item) {	list.addFirst(item); }

	public Object pop() { return list.removeFirst(); }

	public Object peek() {
		return list.getFirst();
	}

	public int size() {
		return list.size();
	}

	public boolean isEmpty() {
		return list.isEmpty();
	}
}
